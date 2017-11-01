# convolution checker

畳み込み層のフィルターが見ている範囲を可視化します．

グラデーションは重みではなく単純に見た回数によって色付けしています(補正をかけています)


# Requirement

- Python: 3.6
- Django: 1.11


# Quick start

シェル上で
```bash
    python manage.py migrate
    python manage.py runserver
```

ブラウザで
```
http://localhost:8000/conv/index
```

