# Como subir el proyecto a GitHub

1. Entrar a https://github.com/ e iniciar sesion.
2. Crear un repositorio publico, por ejemplo: `examen-final-api-pedidos`.
3. Abrir una terminal dentro de la carpeta del proyecto.
4. Ejecutar:

```bash
git init
git add .
git commit -m "Entrega examen final API pedidos"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

5. Copiar el enlace del repositorio.
6. Reemplazar el texto pendiente en `DOCUMENTO_ENTREGA.txt` y `DOCUMENTO_ENTREGA.pdf`.

Importante: si `.env` no sube a GitHub por estar en `.gitignore`, no hay problema. El archivo `.env.example` queda disponible para mostrar las variables necesarias.
