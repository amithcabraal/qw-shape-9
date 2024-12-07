export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen().catch((e) => {
      console.error(`Error attempting to enable fullscreen: ${e.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

export function isFullscreen(): boolean {
  return !!document.fullscreenElement;
}