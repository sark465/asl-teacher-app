FROM python:3.11-alpine AS builder
WORKDIR /install
RUN apk add --no-cache build-base postgresql-dev
COPY app/requirements.txt .
RUN pip wheel --no-cache-dir -r requirements.txt -w /wheels

FROM python:3.11-alpine
WORKDIR /app
RUN apk add --no-cache libpq
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*.whl
COPY app /app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
