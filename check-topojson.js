import fs from 'fs';

console.log('Vérification du fichier TopoJSON...\n');

const filePath = './public/data/ne_50m_admin_0_countries_lakes.json';

try {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log('Taille du fichier:', data.length, 'caractères');
    console.log('Premiers 200 caractères:', data.substring(0, 200));
    console.log('\n---\n');
    
    const parsed = JSON.parse(data);
    console.log('JSON parsé avec succès!');
    console.log('Clés de premier niveau:', Object.keys(parsed));
    
    if (parsed.type) {
        console.log('Type:', parsed.type);
    }
    
    if (parsed.objects) {
        console.log('Clés dans objects:', Object.keys(parsed.objects));
        const firstKey = Object.keys(parsed.objects)[0];
        console.log('\nPremière clé:', firstKey);
        if (parsed.objects[firstKey]) {
            console.log('Type de l\'objet:', parsed.objects[firstKey].type);
            if (parsed.objects[firstKey].geometries) {
                console.log('Nombre de géométries:', parsed.objects[firstKey].geometries.length);
            }
        }
    } else {
        console.log('ATTENTION: La propriété "objects" est manquante ou undefined!');
        console.log('Contenu complet:', JSON.stringify(parsed).substring(0, 500));
    }
} catch (error) {
    console.error('Erreur:', error.message);
    if (error.stack) {
        console.error(error.stack);
    }
}

