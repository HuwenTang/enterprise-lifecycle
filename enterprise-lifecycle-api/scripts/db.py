import pymysql

_config = dict(
    host="192.168.192.2",
    user="enterprise_lifecycle",
    password="enterprise_lifecycle",
    db="enterprise_lifecycle",
)


def connect():
    return pymysql.connect(**_config)
