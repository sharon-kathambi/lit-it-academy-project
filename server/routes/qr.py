import qrcode
import io
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
 
router = APIRouter(prefix="/api/qr", tags=["qr"])
 
 
@router.get("/")
def generate_qr(table: int = 0):
    base_url = os.getenv("FRONTEND_URL")
    url = f"{base_url}/feedback" if table == 0 else f"{base_url}/feedback?table={table}"
 
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
 
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
 
    filename = f"table-{table}-qr.png" if table else "feedback-qr.png"
    return StreamingResponse(
        buf,
        media_type="image/png",
        headers={"Content-Disposition": f"inline; filename={filename}"}
    )
 