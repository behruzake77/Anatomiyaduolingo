package com.corpus.anatomy;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.DownloadListener;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * CORPUS — oflayn WebView qobiq.
 * Veb-ilova (Next.js statik eksport) APK ichidagi assets/www/ dan
 * file:///android_asset/www/index.html orqali yuklanadi; internet faqat
 * 3D modellar (Sketchfab) va kutubxona PDF'lari (GitHub) uchun kerak.
 */
public class MainActivity extends Activity {

    private WebView wv;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        wv = new WebView(this);
        WebSettings s = wv.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);

        wv.setWebViewClient(new LocalClient(this));
        wv.setDownloadListener(new ExternalOpen(this));
        wv.setBackgroundColor(Color.parseColor("#F8F9FA"));

        setContentView(wv);
        wv.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onBackPressed() {
        if (wv != null && wv.canGoBack()) {
            wv.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        if (wv != null) wv.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (wv != null) wv.onResume();
    }

    @Override
    protected void onDestroy() {
        if (wv != null) wv.destroy();
        super.onDestroy();
    }

    /** Mahalliy fayllarni assets/www/ ga yo'naltiradi; tashqi havolalar brauzerga. */
    static class LocalClient extends WebViewClient {
        private final Activity ctx;

        LocalClient(Activity ctx) {
            this.ctx = ctx;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url.startsWith("file:") || url.startsWith("data:")
                    || url.startsWith("about:") || url.startsWith("blob:")) {
                return false; // ichki yuklash (intercept qilinadi)
            }
            openExternally(ctx, url);
            return true;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (!"file".equals(uri.getScheme())) {
                return null; // https (Sketchfab, PDF) — tarmoqdan
            }
            String path = uri.getPath();
            if (path == null) return null;
            if (path.startsWith("/android_asset")) {
                path = path.substring("/android_asset".length());
            }
            if (path.equals("/")) path = "/index.html";
            String asset = "www" + path;
            try {
                AssetManager am = ctx.getAssets();
                InputStream in = am.open(asset);
                return new WebResourceResponse(mime(path), charset(mime(path)), in);
            } catch (IOException e) {
                return null;
            }
        }

        private static String mime(String path) {
            String p = path.toLowerCase();
            if (p.endsWith(".html")) return "text/html";
            if (p.endsWith(".js")) return "text/javascript";
            if (p.endsWith(".css")) return "text/css";
            if (p.endsWith(".png")) return "image/png";
            if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
            if (p.endsWith(".svg")) return "image/svg+xml";
            if (p.endsWith(".webp")) return "image/webp";
            if (p.endsWith(".gif")) return "image/gif";
            if (p.endsWith(".woff2")) return "font/woff2";
            if (p.endsWith(".woff")) return "font/woff";
            if (p.endsWith(".json")) return "application/json";
            if (p.endsWith(".pdf")) return "application/pdf";
            if (p.endsWith(".txt")) return "text/plain";
            if (p.endsWith(".ico")) return "image/x-icon";
            return "application/octet-stream";
        }

        private static String charset(String mime) {
            if (mime.startsWith("text/") || mime.equals("application/json")
                    || mime.equals("image/svg+xml")) {
                return "utf-8";
            }
            return null;
        }
    }

    /** Yuklab olishlar (masalan PDF) — tashqi ilovada ochish. */
    static class ExternalOpen implements DownloadListener {
        private final Activity ctx;

        ExternalOpen(Activity ctx) {
            this.ctx = ctx;
        }

        @Override
        public void onDownloadStart(String url, String ua, String cd, String mime, long size) {
            openExternally(ctx, url);
        }
    }

    private static void openExternally(Activity ctx, String url) {
        try {
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(i);
        } catch (ActivityNotFoundException ignored) {
            // hech qanday mos ilova yo'q — jim o'tamiz
        }
    }
}
