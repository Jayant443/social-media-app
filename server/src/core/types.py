from sqlalchemy import LargeBinary, TypeDecorator
from uuid import UUID

class BinaryUUID(TypeDecorator):
    impl = LargeBinary(16)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            if isinstance(value, UUID):
                return value.bytes
            if isinstance(value, str):
                return UUID(value).bytes
            return value
        return None

    def process_result_value(self, value, dialect):
        if value is not None:
            return UUID(bytes=value)
        return None