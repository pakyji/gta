#!/bin/bash
# Live check of the login rules against the running app and a real PostgreSQL.
B=http://127.0.0.1:3100
J='Content-Type: application/json'
pass=0; fail=0
check() { # name, expected, actual
  if [ "$2" == "$3" ]; then echo "PASS  $1"; pass=$((pass+1)); else echo "FAIL  $1 (expected $2, got $3)"; fail=$((fail+1)); fi
}
code() { curl -s -o /tmp/body.json -w "%{http_code}" "$@"; }
field() { python3 -c "import sys,json; d=json.load(open('/tmp/body.json')); print(eval('d'+sys.argv[1]) if True else '')" "$1" 2>/dev/null; }

# 1. New account: password is required
check "POST without password -> 400" 400 "$(code -X POST -H "$J" -d '{"gamertag":"Pro_Bro","platform":"ps5"}' $B/api/session)"

# 2. New account created with password -> 201 + token
c=$(code -X POST -H "$J" -d '{"gamertag":"Pro_Bro","platform":"ps5","password":"hunter22"}' $B/api/session)
check "POST new account -> 201" 201 "$c"
TOKEN=$(python3 -c "import json;print(json.load(open('/tmp/body.json'))['token'])")
UID1=$(python3 -c "import json;print(json.load(open('/tmp/body.json'))['user']['id'])")

# 3. Same gamertag, different case, correct password -> same account
c=$(code -X POST -H "$J" -d '{"gamertag":"pro_bro","platform":"ps5","password":"hunter22"}' $B/api/session)
check "case-insensitive login with right password -> 201" 201 "$c"
UID2=$(python3 -c "import json;print(json.load(open('/tmp/body.json'))['user']['id'])")
check "same account id (no duplicate user)" "$UID1" "$UID2"

# 4. Wrong password -> 401 wrong_password
c=$(code -X POST -H "$J" -d '{"gamertag":"Pro_Bro","platform":"ps5","password":"wrongpass"}' $B/api/session)
check "wrong password -> 401" 401 "$c"
check "wrong password error code" "wrong_password" "$(python3 -c "import json;print(json.load(open('/tmp/body.json')).get('code'))")"

# 5. Someone else cannot take the account by just knowing the gamertag
c=$(code -X POST -H "$J" -d '{"gamertag":"Pro_Bro","platform":"ps4","password":"abcdef1"}' $B/api/session)
check "impersonation attempt with other password -> 401" 401 "$c"

# 6. Legacy account (no password yet): first login sets the password
c=$(code -X POST -H "$J" -d '{"gamertag":"OldFriend","platform":"ps5","password":"legacy123"}' $B/api/session)
check "legacy account first login -> 201" 201 "$c"
c=$(code -X POST -H "$J" -d '{"gamertag":"OldFriend","platform":"ps5","password":"notthis1"}' $B/api/session)
check "legacy account after claim, wrong password -> 401" 401 "$c"

# 7. Stored password is a hash, never plain text
hash=$(PGPASSWORD=postgres psql -h 127.0.0.1 -U postgres -d app_db -tAc "select password_hash from users where gamertag='Pro_Bro'")
check "password stored as scrypt hash" "1" "$(echo "$hash" | grep -c '^scrypt\$')"
check "plain password not stored" "0" "$(PGPASSWORD=postgres psql -h 127.0.0.1 -U postgres -d app_db -tAc "select count(*) from users where password_hash like '%hunter22%'" | tr -d ' ')"

# 8. Token in URL does not authenticate an API call
c=$(curl -s "$B/api/session?token=$TOKEN")
check "token in query string -> no user" "None" "$(echo "$c" | python3 -c "import sys,json;print(json.load(sys.stdin)['user'])")"
c=$(curl -s -H "Authorization: Bearer $TOKEN" "$B/api/session")
check "token in Authorization header -> user found" "Pro_Bro" "$(echo "$c" | python3 -c "import sys,json;print(json.load(sys.stdin)['user']['gamertag'])")"

# 9. Changing gamertag to a name that another account uses -> 409
c=$(code -X PATCH -H "$J" -H "Authorization: Bearer $TOKEN" -d '{"gamertag":"taken_name"}' $B/api/session)
check "rename to someone else's gamertag -> 409" 409 "$c"
c=$(code -X PATCH -H "$J" -H "Authorization: Bearer $TOKEN" -d '{"platform":"ps4"}' $B/api/session)
check "change platform only -> 200" 200 "$c"

# 10. News refresh needs the secret
check "news refresh without secret -> 401" 401 "$(code -X POST $B/api/news/refresh)"
check "news refresh with secret -> 503 (no feed configured)" 503 "$(code -X POST -H 'Authorization: Bearer test-secret-1234567890' $B/api/news/refresh)"

# 11. Chat still loads with the DB
check "chat history GET -> 200" 200 "$(code $B/api/chat/ps5)"

echo "----"
echo "passed: $pass  failed: $fail"
