package com.gtaonlinecommunity.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Full-screen WebView shell for the GTA Online Community web app.
 *
 * - Loads BuildConfig.APP_URL (set at build time; see android/README or docs/ANDROID_APK.md).
 * - Keeps in-app navigation on the app's own host; other links open in the browser.
 * - Shows a bundled offline page when the site cannot be reached.
 */
public class MainActivity extends Activity {

    /** Custom scheme used by the offline page's Retry button. */
    private static final String RETRY_SCHEME = "gtacommunity";

    private WebView webView;
    private String appHost;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String appUrl = BuildConfig.APP_URL;
        appHost = Uri.parse(appUrl).getHost();

        webView = new WebView(this);
        setContentView(webView);

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
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            // Only the main page: sub-resource failures (images, API calls) are handled by the page.
            if (request.isForMainFrame()) {
                view.loadDataWithBaseURL(BuildConfig.APP_URL, loadOfflinePage(), "text/html", "UTF-8", null);
            }
        }
    }
}
