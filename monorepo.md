# MonoRepo

Aprende a migrar tus repositorios a una estructura de monorepositorio multipaquete para mejorar la mantenibilidad de tu código, compartir dependencias de NPM y configuraciones

Esto lo puedes lograr con npm workspaces, una nueva funcionalidad disponible a partir de la **versión 7 de npm**.

- Creación de estructura de directorios para el monorepo
  - proyecto -> package.json (private = true)
  - workspaces
    - wks1 -> package.json
    - wks2 -> package.json
- Unificando elementos de configuración:
  - linter: pasa a la raíz desde ambos proyectos
  - un único repositorio git (en raíz)
- Usando npm workspaces

  - package.json global
        "workspaces": ["workspaces/wks1", "workspaces/*"]
  - no existirán node-modules / package-loc de wks1 y wks (node-modules solo global)
        (si existen por ser una migración, se eliminan)
  - si se instalan nuevos paquetes se utiliza el modificador --workspace
        Crea la dependencia localmente pero instala en node_modules global
  - npm install desde el nivel superior: aplana las dependencias :
        actualiza node-modules global con todas las dependencias de los workspaces
