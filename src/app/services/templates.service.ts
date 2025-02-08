import { Injectable } from '@angular/core';

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  [x: string]: any;

  private readonly templates: CodeTemplate[] = [
    {
      id: 'express-api',
      name: 'Express API Server',
      description: 'Basic Express.js API setup with middleware and routes',
      language: 'javascript',
      category: 'Backend',
      tags: ['nodejs', 'api', 'express'],
      code: `const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/data', (req, res) => {
  // Handle data
  res.json({ success: true });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
    },
    {
      id: 'react-component',
      name: 'React Component',
      description: 'TypeScript React component with hooks',
      language: 'typescript',
      category: 'Frontend',
      tags: ['react', 'typescript', 'component'],
      code: `import React, { useState, useEffect } from 'react';

interface Props {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-component">
      <h2>{title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="data-list">
          {data.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      )}
      <button onClick={onAction}>Action</button>
    </div>
  );
};`
    }
    // Add more templates...
  ];

  getTemplates(): CodeTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): CodeTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  getTemplatesByLanguage(language: string): CodeTemplate[] {
    return this.templates.filter(t => t.language === language);
  }

  getTemplatesByCategory(category: string): CodeTemplate[] {
    return this.templates.filter(t => t.category === category);
  }
} 