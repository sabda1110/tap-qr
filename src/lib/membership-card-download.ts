export async function downloadMembershipCard(input: { qrUrl: string; outlet: string; name: string; id: string; status: string; stamps: string; reward: string }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080; canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("CANVAS_UNAVAILABLE");
  context.fillStyle = "#fff4a8"; context.fillRect(0, 0, 1080, 1350);
  context.fillStyle = "#fffdf4"; context.fillRect(70, 70, 940, 1210);
  context.strokeStyle = "#111"; context.lineWidth = 14; context.strokeRect(70, 70, 940, 1210);
  context.fillStyle = "#111"; context.font = "900 56px sans-serif"; context.fillText(input.outlet.toUpperCase(), 120, 165, 840);
  context.font = "800 34px sans-serif"; context.fillText(input.name.toUpperCase(), 120, 245, 840);
  context.font = "700 27px sans-serif"; context.fillText(input.id, 120, 300);
  context.fillStyle = "#ffb332"; context.fillRect(120, 350, 840, 110);
  context.strokeStyle = "#111"; context.lineWidth = 8; context.strokeRect(120, 350, 840, 110);
  context.fillStyle = "#111"; context.font = "900 31px sans-serif"; context.fillText(input.status.toUpperCase(), 155, 420, 760);
  context.font = "900 40px sans-serif"; context.fillText(input.stamps, 120, 535);
  context.font = "700 27px sans-serif"; context.fillText(input.reward, 120, 585, 840);
  const qr = new Image(); qr.src = input.qrUrl; await qr.decode();
  context.drawImage(qr, 290, 640, 500, 500);
  context.font = "800 25px sans-serif"; context.textAlign = "center"; context.fillText("TUNJUKKAN QR INI KE KASIR", 540, 1200);
  const link = document.createElement("a");
  link.download = `TapQR-${input.id}.png`; link.href = canvas.toDataURL("image/png"); link.click();
}
