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

export const getDefaultCV = () => ({
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    templateId: 'minimal',
    fontFamily: 'Inter',
    personalInfo: {
        fullName: 'Juan Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '+34 612 345 678',
        address: 'Barcelona, España',
        website: 'https://github.com/juanperez',
        photo: null,
        showQrCode: true,
        qrCodeType: 'github',
        summary: 'Desarrollador Full Stack con más de 5 años de experiencia en la creación de aplicaciones web escalables y eficientes. Apasionado por el código limpio, arquitecturas modernas y UI minimalistas.',
    },
    experience: [
        {
            id: crypto.randomUUID(),
            company: 'Tech Solutions Inc.',
            position: 'Desarrollador Web Senior',
            startDate: '2021-01',
            endDate: '',
            isCurrent: true,
            showDuration: false,
            description: 'Lideré el desarrollo del frontend usando <mark>React</mark> y <span style="color:#ea580c">Node.js</span>. Mejoré el rendimiento de renderizado en un 40% implementando técnicas avanzadas de paginación.'
        },
        {
            id: crypto.randomUUID(),
            company: 'Agencia Creativa Digital',
            position: 'Desarrollador Frontend',
            startDate: '2018-03',
            endDate: '2020-12',
            isCurrent: false,
            showDuration: false,
            description: 'Creación de interfaces de usuario atractivas. Integración con APIs REST. Trabajo bajo metodologías ágiles (Scrum).'
        }
    ],
    education: [
        {
            id: crypto.randomUUID(),
            institution: 'Universidad Politécnica de Madrid',
            degree: 'Grado en Ingeniería Informática',
            year: '2014 - 2018'
        }
    ],
    skills: [
        { id: crypto.randomUUID(), name: 'JavaScript' },
        { id: crypto.randomUUID(), name: 'React' },
        { id: crypto.randomUUID(), name: 'Node.js' },
        { id: crypto.randomUUID(), name: 'CSS/SASS' },
        { id: crypto.randomUUID(), name: 'UI/UX Design' },
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
