export const STORAGE_KEY = 'cv_creator_data';

export const getSavedCVs = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveCV = (cv) => {
    const cvs = getSavedCVs();
    const index = cvs.findIndex((item) => item.id === cv.id);
    if (index >= 0) {
        cvs[index] = cv;
    } else {
        cvs.push(cv);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
};

export const deleteCV = (id) => {
    const cvs = getSavedCVs();
    const newCvs = cvs.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCvs));
};

const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
};

export const getDefaultCV = () => ({
    id: generateUUID(),
    templateId: 'minimal',
    fontFamily: 'Inter',
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        photo: null,
        showQrCode: false,
        qrCodeType: 'link',
        summary: '',
    },
    experience: [],
    education: [],
    skills: [],
});

export const getSampleCV = () => ({
    id: 'demo-1',
    templateId: 'minimal',
    fontFamily: 'Inter',
    personalInfo: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 555 123 4567',
        address: 'New York, USA',
        website: 'https://github.com/johndoe',
        photo: null,
        showQrCode: true,
        qrCodeType: 'github',
        summary: 'Senior Full Stack Developer with over 8 years of experience building scalable web applications. Passionate about clean code, modern architectures, and minimalist UI.',
    },
    experience: [
        {
            id: generateUUID(),
            company: 'Tech Solutions Inc.',
            position: 'Senior Web Developer',
            startDate: '2021-01',
            endDate: '',
            isCurrent: true,
            showDuration: false,
            description: 'Leading frontend development using <mark>React</mark> and <span style="color:#ea580c">Node.js</span>. Improved rendering performance by 40%.'
        },
        {
            id: generateUUID(),
            company: 'Digital Creative Agency',
            position: 'Frontend Developer',
            startDate: '2018-03',
            endDate: '2020-12',
            isCurrent: false,
            showDuration: false,
            description: 'Building engaging user interfaces. Integrating with REST APIs. Working under Agile methodologies.'
        }
    ],
    education: [
        {
            id: generateUUID(),
            institution: 'MIT University',
            degree: 'Computer Science Degree',
            year: '2014 - 2018'
        }
    ],
    skills: [
        { id: generateUUID(), name: 'JavaScript' },
        { id: generateUUID(), name: 'React' },
        { id: generateUUID(), name: 'Node.js' },
        { id: generateUUID(), name: 'Tailwind CSS' },
        { id: generateUUID(), name: 'UI/UX Design' },
    ],
});

export const getSampleCV2 = () => ({
    id: 'demo-2',
    templateId: 'modern',
    fontFamily: 'Outfit',
    personalInfo: {
        fullName: 'Sarah Smith',
        email: 'sarah.design@example.com',
        phone: '+44 20 7946 0958',
        address: 'London, UK',
        website: 'https://behance.net/sarahsmith',
        photo: null,
        showQrCode: true,
        qrCodeType: 'link',
        summary: 'Creative Graphic Designer with a focus on brand identity and digital experiences. 12+ years of experience working with global brands.',
    },
    experience: [
        {
            id: generateUUID(),
            company: 'Global Design Studio',
            position: 'Art Director',
            startDate: '2019-06',
            endDate: '',
            isCurrent: true,
            showDuration: false,
            description: 'Leading creative teams for international marketing campaigns. Specialized in <span style="color:#6366f1">branding</span> and visual storytelling.'
        }
    ],
    education: [
        {
            id: generateUUID(),
            institution: 'Royal College of Art',
            degree: 'MA Communication Design',
            year: '2015 - 2017'
        }
    ],
    skills: [
        { id: generateUUID(), name: 'Adobe Creative Suite' },
        { id: generateUUID(), name: 'Figma' },
        { id: generateUUID(), name: 'Brand Identity' },
        { id: generateUUID(), name: 'Typography' },
        { id: generateUUID(), name: 'Motion Graphics' },
    ],
});

export const exportAllData = () => {
    const data = getSavedCVs();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];

    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importData = (jsonData) => {
    try {
        const data = JSON.parse(jsonData);
        if (!Array.isArray(data)) throw new Error('Invalid format');

        // Simple validation: each item should have an id
        const valid = data.every(cv => cv.id);
        if (!valid) throw new Error('Invalid data content');

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
};
