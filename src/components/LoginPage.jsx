import React, { useState, useEffect } from "react";
import { loginUser } from "../api";

function LoginPage({ onLogin }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ["Contribute", "Scan","deploy"];

  // GitHub OAuth configuration
  const GITHUB_CLIENT_ID = "Ov23lijDkAs2XMehuAoq";
  REACT_APP_REDIRECT_URI = "https://statuesque-gingersnap-b01a55.netlify.app/login/callback";


  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 75 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  // Check if redirected back from GitHub with code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      handleGitHubCallback(code);
    }
  }, []);

  const handleGitHubCallback = async (code) => {
    setLoading(true);
    setError("");
    try {
      const response = await loginUser(code);
      if (response.username && response.role) {
        onLogin(response);
      } else {
        setError("You are not part of the project / contributor list.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  const styles = {
    container: {
      minHeight: "100vh",
      // Lighter, bluish gradient
      background: "linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)", 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    },
    card: {
      maxWidth: "450px",
      width: "100%",
      // Slightly more opaque background for better contrast
      background: "rgba(255, 255, 255, 0.2)", 
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      border: "1px solid rgba(255, 255, 255, 0.18)"
    },
    heading: {
      textAlign: "center",
      marginBottom: "30px"
    },
    title: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: "10px"
    },
    animatedText: {
      // Adjusted gradient for animated text to fit the new blue theme
      background: "linear-gradient(90deg, #89f7fe, #66a6ff)", 
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    },
    cursor: {
      animation: "blink 1s infinite"
    },
    subtitle: {
      color: "#e0e7ff", // Lighter subtitle text
      fontSize: "14px",
      marginTop: "10px"
    },
    buttonContainer: {
      marginTop: "20px"
    },
    githubButton: {
      width: "100%",
      padding: "14px 16px",
      background: "#24292e", // Keep GitHub button dark for brand consistency
      border: "none",
      borderRadius: "10px",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(36, 41, 46, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    },
    githubIcon: {
      width: "24px",
      height: "24px"
    },
    error: {
      marginTop: "20px",
      padding: "12px",
      background: "rgba(239, 68, 68, 0.2)",
      border: "1px solid rgba(239, 68, 68, 0.5)",
      borderRadius: "8px",
      color: "#fecaca",
      fontSize: "14px",
      textAlign: "center"
    },
    footer: {
      color: "#d1d5db", // Lighter footer text
      fontSize: "12px",
      marginTop: "24px"
    },
    spinner: {
      border: "3px solid rgba(255, 255, 255, 0.3)",
      borderTop: "3px solid #ffffff",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      animation: "spin 1s linear infinite",
      display: "inline-block"
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(36, 41, 46, 0.6);
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        button:disabled:hover {
          transform: none;
        }
      `}</style>
      
      <div style={styles.card}>
        <div style={styles.heading}>
          <h1 style={styles.title}>
            Ready to{" "}
            <span style={styles.animatedText}>
              {text}
              <span style={styles.cursor}>|</span>
            </span>
          </h1>
          <p style={styles.subtitle}>
            Sign in with GitHub to get started
          </p>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleGitHubLogin}
            style={styles.githubButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Authenticating...
              </>
            ) : (
              <>
                <svg style={styles.githubIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            <p>{error}</p>
          </div>
        )}

        <p style={styles.footer}>
          Secure authentication powered by GitHub OAuth
        </p>
      </div>
    </div>
  );
}

export default LoginPage;