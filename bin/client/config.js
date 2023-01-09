const slugify = require("slugify")

module.exports.config = {
    publicImagesDirectoryName: "images",
    router: {
        workspaceBasePath: "c",
        generateRoutePathFromFilePath(filePath, hash = "") {
            const filePathWithoutExtension = filePath.substring(0, filePath.lastIndexOf('.'))
            return filePathWithoutExtension.split('/').map(val => slugify(val, {lower: true})).join('/') + hash
        }
    }
}
