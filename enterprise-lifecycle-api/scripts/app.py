import os
import uuid
from wsgiref.simple_server import make_server
from flask import Flask, jsonify, request

import project_online_approval

app = Flask(__name__)


@app.post("/pys/project_online_approval")
def upload_project_online_approval():
    file = request.files["file"]
    if (
        file.content_type != "application/octet-stream"
        and not file.content_type.startswith(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    ):
        return jsonify(status=415, message="Unsupported Media Type"), 415
    filename = f"/tmp/{uuid.uuid4()}.{file.filename.split(".")[-1]}"
    file.save(filename)
    try:
        resp = project_online_approval.main(filename)
        return jsonify(resp)
    except Exception as e:
        return jsonify(status=500, message=str(e)), 500
    finally:
        os.remove(filename)


if __name__ == "__main__":
    # app.run(debug=True)
    with make_server(
        host="0.0.0.0",
        port=5000,
        app=app,
    ) as server:
        server.serve_forever()
