import React from "react";

export default function Footer({ tr }) {
    const year = new Date().getFullYear();
    return (
        <footer
            style={{
                marginTop: 40,
                padding: "18px 16px",
                borderTop: "1px solid #e2e8f0",
                color: "#475569",
                background: "#fafafa",
                borderRadius: 16,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                        src="/logo-bharakoto.jpg"
                        alt="ভাড়া কত? logo"
                        style={{ height: 36, width: 36, objectFit: "cover", borderRadius: 6 }}
                    />
                    <strong>ভাড়া কত?</strong>
                </div>

                <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <a href="#" style={linkStyle}>{tr.footerAbout}</a>
                    <a href="#" style={linkStyle}>{tr.footerDisclaimer}</a>
                    <a href="#" style={linkStyle}>{tr.footerData}</a>
                </nav>
            </div>

            <div
                style={{
                    marginTop: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <span>© {year} ভাড়া কত?</span>
                    <span>🚌 {tr.footerMade}</span>
                </div>

                {/* Socials */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, marginRight: 6 }}>{tr.footerFollow}:</span>

                    <IconLink label="Facebook" href="https://facebook.com/mhbappi05">
                        <FacebookIcon />
                    </IconLink>

                    <IconLink label="X (Twitter)" href="https://x.com/mhbappi05">
                        <XIcon />
                    </IconLink>

                    <IconLink label="Instagram" href="https://instagram.com/mhbappi05">
                        <InstagramIcon />
                    </IconLink>

                    <IconLink label="YouTube" href="https://youtube.com/@yourchannel">
                        <YouTubeIcon />
                    </IconLink>

                    <IconLink label="GitHub" href="https://github.com/mhbappi05">
                        <GitHubIcon />
                    </IconLink>

                </div>
               
            </div>
             {/* Credits line */}
             <div style={{ marginTop: 6, fontSize: 13, color: "#334155", display: "justify-content", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {tr.footerDesignBy}: <strong><a href="https://www.instagram.com/uwusha_a" style={{ color: "#0a8f3d", textDecoration: "none" }}>Jannatul Haque Usha</a></strong>
                    </span>
                    <span>·</span>
                    <span>
                        {tr.footerDevelopedBy}: <strong><a href="https://facebook.com/mhbappi05" style={{ color: "#0a8f3d", textDecoration: "none" }}>Md Mahmudul Hasan</a></strong>
                    </span>
                </div>
        </footer>
    );
}

function IconLink({ href, label, children }) {
    return (
        <a
            href={href}
            aria-label={label}
            title={label}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                textDecoration: "none",
                color: "#0a8f3d",          // <-- icon color
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#086a2e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#0a8f3d")}
        >
            {children}
        </a>
    );
}


const linkStyle = {
    textDecoration: "none",
    color: "#0a8f3d",
    fontWeight: 600,
};

/* --- Minimal inline SVG icons (no deps) --- */
function FacebookIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.14 8.44 9.93v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.22.2 2.22.2v2.44h-1.25c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.9h-2.32V22c4.78-.79 8.44-4.93 8.44-9.93z" />
        </svg>
    );
}
function XIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.9 2H22l-8.1 9.26L22.9 22H16l-5.32-6.38L4.6 22H1.5l8.66-9.9L1 2h6l4.78 5.74L18.9 2z" />
        </svg>
    );
}
function InstagramIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm5.75-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z" />
        </svg>
    );
}
function YouTubeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.75 15.5V8.5L15.5 12z" />
        </svg>
    );
}
function GitHubIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.2 3.1.9.1-.7.4-1.2.7-1.5-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.7 1.1 2.8 0 3.9-2.4 4.7-4.6 5 .4.3.8 1 .8 2.1v3.1c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
    );
}
function MailIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5.3-8-5.3V6l8 5.3L20 6z" />
        </svg>
    );
}
