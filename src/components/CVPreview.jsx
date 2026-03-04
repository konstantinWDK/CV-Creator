import React from 'react';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';

const CVPreview = ({ data }) => {
    // Determine which template to render based on user selection
    switch (data.templateId) {
        case 'modern':
            return <ModernTemplate data={data} />;
        case 'minimal':
        default:
            return <MinimalTemplate data={data} />;
    }
};

export default CVPreview;
