import React from 'react';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalPlusTemplate from './templates/MinimalPlusTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ClassicTemplate from './templates/ClassicTemplate';

const CVPreview = ({ data }) => {
    // Determine which template to render based on user selection
    const content = (() => {
        switch (data.templateId) {
            case 'modern':
                return <ModernTemplate data={data} />;
            case 'minimal-plus':
                return <MinimalPlusTemplate data={data} />;
            case 'professional':
                return <ProfessionalTemplate data={data} />;
            case 'classic':
                return <ClassicTemplate data={data} />;
            case 'minimal':
            default:
                return <MinimalTemplate data={data} />;
        }
    })();

    // Determine the padding values based on the selected setting
    const getPaddingTokens = () => {
        // Enforce zero padding for templates that don't support custom padding
        if (data.templateId === 'modern') {
            return { '--cv-padding-y': '0mm', '--cv-padding-x': '0mm' };
        }

        switch (data.paddingLevel) {
            case 'compact': // "Un poco" (Minimalist original padding)
                return { '--cv-padding-y': '3mm', '--cv-padding-x': '4mm' };
            case 'medium': // "Un poco más"
                return { '--cv-padding-y': '8mm', '--cv-padding-x': '10mm' };
            case 'normal':
            default:
                // "Normal" padding (slightly less than the original 18mm wide padding)
                return { '--cv-padding-y': '14mm', '--cv-padding-x': '14mm' };
        }
    };

    // Apply the selected font family to a wrapper inside the preview container
    return (
        <div style={{ fontFamily: data.fontFamily || 'Inter', display: 'flex', justifyContent: 'center', width: '100%', ...getPaddingTokens() }}>
            {content}
        </div>
    );
};

export default CVPreview;
