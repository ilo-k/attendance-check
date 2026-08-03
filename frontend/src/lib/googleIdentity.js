let loadPromise = null;

export function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("구글 로그인 스크립트를 불러오지 못했습니다."));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
