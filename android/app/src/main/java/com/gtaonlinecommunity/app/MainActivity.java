package com.gtaonlinecommunity.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * Full-screen WebView shell for the GTA Online Community web app.
 *
 * - Loads BuildConfig.APP_URL (set at build time; see docs/ANDROID_APK.md).
 * - Keeps in-app navigation on the app's own host; other links open in the browser.
 * - Shows a bundled offline page when the site cannot be reached.
 * - Shows a short splash until the first page has loaded.
 * - Menu: Reload, Check for updates, Share app, Open in browser.
 * - Checks GitHub for a newer APK at most once a day and asks before downloading it.
 */
public class MainActivity extends Activity {

    /** Custom scheme used by the offline page's Retry button. */
    private static final String RETRY_SCHEME = "gtacommunity";

    /** Latest published release of the public repo (no login needed). */
    private static final String RELEASES_LATEST = "https://api.github.com/repos/pakyji/gta/releases/latest";

    private static final String PREFS = "gta_prefs";
    private static final String PREF_LAST_CHECK = "last_update_check";
    private static final long CHECK_INTERVAL_MS = 24L * 60 * 60 * 1000;
    private static final long SPLASH_MAX_MS = 5000;

    private static final int MENU_RELOAD = 1;
    private static final int MENU_CHECK_UPDATES = 2;
    private static final int MENU_SHARE = 3;
    private static final int MENU_OPEN_BROWSER = 4;

    private WebView webView;
    private View splash;
    private String appHost;
    private boolean splashHidden = false;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final Runnable splashTimeout = new Runnable() {
        @Override
        public void run() {
            hideSplash();
        }
    };

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String appUrl = BuildConfig.APP_URL;
        appHost = Uri.parse(appUrl).getHost();

        FrameLayout root = new FrameLayout(this);
        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        splash = buildSplash();
        root.addView(splash, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);          // the app is a client-rendered React app
        s.setDomStorageEnabled(true);          // session token + chat draft storage
        s.setMediaPlaybackRequiresUserGesture(false); // music player
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(webView, true);

        webView.setWebViewClient(new AppWebViewClient());

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(appUrl);
        }

        mainHandler.postDelayed(splashTimeout, SPLASH_MAX_MS);
        maybeCheckForUpdate(false);
    }

    private View buildSplash() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setGravity(Gravity.CENTER);
        box.setBackgroundColor(Color.parseColor("#FF0B0B12"));

        TextView title = new TextView(this);
        title.setText(R.string.app_name);
        title.setTextColor(Color.WHITE);
        title.setTextSize(22);
        title.setGravity(Gravity.CENTER);
        box.addView(title);

        ProgressBar bar = new ProgressBar(this);
        LinearLayout.LayoutParams barParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        barParams.topMargin = 40;
        box.addView(bar, barParams);
        return box;
    }

    private void hideSplash() {
        if (splashHidden || splash == null) return;
        splashHidden = true;
        mainHandler.removeCallbacks(splashTimeout);
        splash.animate().alpha(0f).setDuration(250).withEndAction(new Runnable() {
            @Override
            public void run() {
                splash.setVisibility(View.GONE);
            }
        }).start();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onDestroy() {
        mainHandler.removeCallbacksAndMessages(null);
        if (webView != null) {
            webView.stopLoading();
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // ---------- Menu ----------

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, MENU_RELOAD, 0, R.string.menu_reload);
        menu.add(0, MENU_CHECK_UPDATES, 1, R.string.menu_check_updates);
        menu.add(0, MENU_SHARE, 2, R.string.menu_share);
        menu.add(0, MENU_OPEN_BROWSER, 3, R.string.menu_open_browser);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case MENU_RELOAD:
                if (webView != null) webView.reload();
                return true;
            case MENU_CHECK_UPDATES:
                maybeCheckForUpdate(true);
                return true;
            case MENU_SHARE:
                shareApp();
                return true;
            case MENU_OPEN_BROWSER:
                openExternal(Uri.parse(currentUrl()));
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private String currentUrl() {
        if (webView != null && webView.getUrl() != null) return webView.getUrl();
        return BuildConfig.APP_URL;
    }

    private void shareApp() {
        Intent send = new Intent(Intent.ACTION_SEND);
        send.setType("text/plain");
        send.putExtra(Intent.EXTRA_TEXT, getString(R.string.share_text, BuildConfig.APP_URL));
        startActivity(Intent.createChooser(send, getString(R.string.menu_share)));
    }

    // ---------- Update check ----------

    /**
     * @param userRequested true when the user tapped "Check for updates" (always runs,
     *                      and reports the result). false on app start (runs at most once a day).
     */
    private void maybeCheckForUpdate(boolean userRequested) {
        SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        long last = prefs.getLong(PREF_LAST_CHECK, 0);
        if (!userRequested && System.currentTimeMillis() - last < CHECK_INTERVAL_MS) return;
        prefs.edit().putLong(PREF_LAST_CHECK, System.currentTimeMillis()).apply();

        if (userRequested) {
            Toast.makeText(this, R.string.update_checking, Toast.LENGTH_SHORT).show();
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                checkForUpdate(userRequested);
            }
        }).start();
    }

    /** Runs on a background thread. */
    private void checkForUpdate(final boolean userRequested) {
        try {
            JSONObject release = new JSONObject(httpGet(RELEASES_LATEST));
            String tag = release.optString("tag_name", "");
            final String latest = tag.startsWith("v") ? tag.substring(1) : tag;

            String apkUrl = null;
            JSONArray assets = release.optJSONArray("assets");
            if (assets != null) {
                for (int i = 0; i < assets.length(); i++) {
                    JSONObject asset = assets.getJSONObject(i);
                    if (asset.optString("name", "").endsWith(".apk")) {
                        apkUrl = asset.optString("browser_download_url", null);
                        break;
                    }
                }
            }

            final String downloadUrl = apkUrl;
            final boolean newer = !latest.isEmpty() && isNewer(latest, BuildConfig.VERSION_NAME);

            mainHandler.post(new Runnable() {
                @Override
                public void run() {
                    if (isFinishing()) return;
                    if (newer && downloadUrl != null) {
                        showUpdateDialog(latest, downloadUrl);
                    } else if (userRequested) {
                        Toast.makeText(MainActivity.this, R.string.update_up_to_date, Toast.LENGTH_LONG).show();
                    }
                }
            });
        } catch (Exception e) {
            if (userRequested) {
                mainHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        if (isFinishing()) return;
                        Toast.makeText(MainActivity.this, R.string.update_failed, Toast.LENGTH_LONG).show();
                    }
                });
            }
        }
    }

    private void showUpdateDialog(final String latest, final String apkUrl) {
        new AlertDialog.Builder(this)
                .setTitle(R.string.update_available_title)
                .setMessage(getString(R.string.update_available_message, latest, BuildConfig.VERSION_NAME))
                .setPositiveButton(R.string.update_download, new android.content.DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(android.content.DialogInterface dialog, int which) {
                        openExternal(Uri.parse(apkUrl));
                    }
                })
                .setNegativeButton(R.string.update_later, null)
                .show();
    }

    private static String httpGet(String url) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        try {
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);
            conn.setRequestProperty("Accept", "application/vnd.github+json");
            conn.setRequestProperty("User-Agent", "GTA-Online-Community-Android");
            int code = conn.getResponseCode();
            if (code != 200) throw new IOException("HTTP " + code);
            InputStream in = conn.getInputStream();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
            in.close();
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        } finally {
            conn.disconnect();
        }
    }

    /** True when latest is a higher dotted version than current, e.g. 1.1.0 > 1.0.0. */
    static boolean isNewer(String latest, String current) {
        int[] a = parseVersion(latest);
        int[] b = parseVersion(current);
        int len = Math.max(a.length, b.length);
        for (int i = 0; i < len; i++) {
            int x = i < a.length ? a[i] : 0;
            int y = i < b.length ? b[i] : 0;
            if (x != y) return x > y;
        }
        return false;
    }

    private static int[] parseVersion(String v) {
        String[] parts = v.trim().replaceFirst("^v", "").split("\\.");
        int[] out = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            try {
                out[i] = Integer.parseInt(parts[i].replaceAll("[^0-9].*$", ""));
            } catch (NumberFormatException e) {
                out[i] = 0;
            }
        }
        return out;
    }

    // ---------- Links ----------

    private void openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException ignored) {
            // No app can open this link. Nothing else to do.
        }
    }

    private String loadOfflinePage() {
        try (InputStream in = getAssets().open("offline.html")) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "<html><body><p>Cannot reach the server.</p></body></html>";
        }
    }

    private class AppWebViewClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            String scheme = uri.getScheme();

            if (RETRY_SCHEME.equals(scheme)) {
                view.loadUrl(BuildConfig.APP_URL);
                return true;
            }

            if ("https".equals(scheme) || "http".equals(scheme)) {
                // Same host stays inside the app; other sites open in the browser.
                if (uri.getHost() != null && uri.getHost().equalsIgnoreCase(appHost)) {
                    return false;
                }
                openExternal(uri);
                return true;
            }

            // mailto:, tel:, intent: and similar links go to the matching app.
            openExternal(uri);
            return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            hideSplash();
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            // Only the main page: sub-resource failures (images, API calls) are handled by the page.
            if (request.isForMainFrame()) {
                view.loadDataWithBaseURL(BuildConfig.APP_URL, loadOfflinePage(), "text/html", "UTF-8", null);
            }
        }
    }
}
