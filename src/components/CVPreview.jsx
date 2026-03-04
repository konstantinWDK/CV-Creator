import React from 'react';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';

const CVPreview = ({ data }) => {
    // Determine which template to render based on user selection
    const content = (() => {
        switch (data.templateId) {
            case 'modern':
                return <ModernTemplate data={data} />;
            case 'minimal':
            default:
                return <MinimalTemplate data={data} />;
        }
    })();

    // Apply the selected font family to a wrapper inside the preview container
    return (
        <div style={{ fontFamily: data.fontFamily || 'Inter', display: 'flex', justifyContent: 'center', width: '100%' }}>
            {content}
        </div>
    );
};

export default CVPreview;
