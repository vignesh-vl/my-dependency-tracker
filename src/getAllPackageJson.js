const getAllPackageJson = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const packageJsonFiles = data.filter(file => file.name === 'package.json');

        const directories = data.filter(file => file.type === 'dir');

        let dependencies = {};
        let devDependencies = {};
        for (const file of packageJsonFiles) {
            try {
                const fileResponse = await fetch(file.download_url);
                const fileData = await fileResponse.json();
                dependencies = {
                    ...dependencies,
                    ...fileData.dependencies
                };
                devDependencies = {
                    ...devDependencies,
                    ...fileData.devDependencies
                };
            } catch (error) {
                console.error(`Error fetching or parsing ${file.path}:`, error);
            }
        }

        // Recursively extract dependencies from package.json files in subdirectories
        for (const directory of directories) {
            const subDirectoryDependencies = await getAllPackageJson(directory.url);
            dependencies = {
                ...dependencies,
                ...subDirectoryDependencies.dependencies
            };
            devDependencies = {
                ...devDependencies,
                ...subDirectoryDependencies.devDependencies
            };
        }
        return { dependencies, devDependencies };
    } catch (error) {
        console.error('Error:', error);
    }
};

export default getAllPackageJson;
