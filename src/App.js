import React, { useState } from 'react';
import getAllPackageJson from './getAllPackageJson';

const DependencyList = ({ dependencies, devDependencies }) => {
  return (
    <div>
      <h2>Dependencies</h2>
      <ul>
        {Object.entries(dependencies).map(([dependency, version]) => (
          <li key={dependency}>{dependency}: {version}</li>
        ))}
      </ul>
      <h2>Dev Dependencies</h2>
      <ul>
        {Object.entries(devDependencies).map(([dependency, version]) => (
          <li key={dependency}>{dependency}: {version}</li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [dependencyData, setDependencyData] = useState({ dependencies: {}, devDependencies: {} });
  const [repoUrl, setRepoUrl] = useState('');

  const fetchDependencies = async () => {
    try {
      const { dependencies, devDependencies } = await getAllPackageJson(repoUrl);
      setDependencyData({ dependencies, devDependencies });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  return (
    <div>
      <h1>Dependency List</h1>
      <input
        type="text"
        placeholder="Enter GitHub repository URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button onClick={fetchDependencies}>Fetch Dependencies</button>
      {Object.keys(dependencyData.dependencies).length > 0 && (
        <DependencyList dependencies={dependencyData.dependencies} devDependencies={dependencyData.devDependencies} />
      )}
    </div>
  );
};

export default App;
