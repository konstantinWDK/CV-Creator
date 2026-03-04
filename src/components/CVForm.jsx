import PersonalInfo from './sections/PersonalInfo';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Skills from './sections/Skills';

const CVForm = ({ data, onChange, activeTab }) => {
    const updateSection = (section, newValue) => {
        onChange({
            ...data,
            [section]: newValue,
        });
    };

    return (
        <div className="cv-form">
            {activeTab === 'personalInfo' && (
                <PersonalInfo
                    data={data.personalInfo}
                    onChange={(val) => updateSection('personalInfo', val)}
                />
            )}
            {activeTab === 'experience' && (
                <Experience
                    data={data.experience}
                    onChange={(val) => updateSection('experience', val)}
                />
            )}
            {activeTab === 'education' && (
                <Education
                    data={data.education}
                    onChange={(val) => updateSection('education', val)}
                />
            )}
            {activeTab === 'skills' && (
                <Skills
                    data={data.skills}
                    onChange={(val) => updateSection('skills', val)}
                />
            )}
        </div>
    );
};

export default CVForm;
