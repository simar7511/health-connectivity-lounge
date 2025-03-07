
// This is a simplified implementation of offline capabilities for the health assistant

// Define the OfflineModeType as a proper TypeScript type with literal types
export type OfflineModeType = "localLLM" | "simulated" | "none";

/**
 * Gets a sample response for common health queries
 * @param query - The user's query
 * @param language - The language to respond in
 * @returns string - A sample response
 */
export const getSampleResponse = (
  query: string,
  language: "en" | "es" = "en"
): string => {
  const lowerQuery = query.toLowerCase();
  
  // Mental Health Topics
  if (lowerQuery.includes("depression") || lowerQuery.includes("depresión")) {
    return language === "en"
      ? "Depression is a common but serious mood disorder that affects how you feel, think, and handle daily activities. Symptoms can include persistent sadness, feelings of emptiness, loss of interest in activities, sleep disturbances, and difficulty concentrating. If you've been experiencing these symptoms for more than two weeks, it's important to speak with a healthcare provider. Treatment options include therapy, medication, lifestyle changes, and support groups. Remember that depression is a medical condition, not a sign of weakness, and effective treatments are available."
      : "La depresión es un trastorno del estado de ánimo común pero serio que afecta cómo te sientes, piensas y manejas las actividades diarias. Los síntomas pueden incluir tristeza persistente, sentimientos de vacío, pérdida de interés en actividades, trastornos del sueño y dificultad para concentrarse. Si has estado experimentando estos síntomas por más de dos semanas, es importante hablar con un proveedor de atención médica. Las opciones de tratamiento incluyen terapia, medicación, cambios en el estilo de vida y grupos de apoyo. Recuerda que la depresión es una condición médica, no un signo de debilidad, y hay tratamientos efectivos disponibles.";
  }
  
  if (lowerQuery.includes("anxiety") || lowerQuery.includes("ansiedad")) {
    return language === "en"
      ? "Anxiety disorders involve excessive worry or fear that interferes with daily activities. Common symptoms include restlessness, feeling on edge, fatigue, difficulty concentrating, irritability, muscle tension, and sleep problems. There are several types of anxiety disorders, including generalized anxiety disorder, panic disorder, and social anxiety disorder. Treatment approaches may include cognitive-behavioral therapy, medication, stress management techniques, and lifestyle changes like regular exercise and adequate sleep. If anxiety is affecting your quality of life, consider speaking with a healthcare provider for proper evaluation and support."
      : "Los trastornos de ansiedad involucran preocupación o miedo excesivo que interfiere con las actividades diarias. Los síntomas comunes incluyen inquietud, sentirse al límite, fatiga, dificultad para concentrarse, irritabilidad, tensión muscular y problemas de sueño. Hay varios tipos de trastornos de ansiedad, incluyendo trastorno de ansiedad generalizada, trastorno de pánico y trastorno de ansiedad social. Los enfoques de tratamiento pueden incluir terapia cognitivo-conductual, medicación, técnicas de manejo del estrés y cambios en el estilo de vida como ejercicio regular y sueño adecuado. Si la ansiedad está afectando tu calidad de vida, considera hablar con un proveedor de atención médica para una evaluación y apoyo adecuados.";
  }

  // Diet and Nutrition Topics
  if (lowerQuery.includes("diet") || lowerQuery.includes("nutrition") || lowerQuery.includes("dieta") || lowerQuery.includes("nutrición")) {
    return language === "en"
      ? "A balanced diet is foundational to good health. The key components include: 1) Fruits and vegetables (aim for half your plate), which provide essential vitamins, minerals, and fiber; 2) Whole grains like brown rice, oats, and whole wheat bread for energy and additional fiber; 3) Lean proteins such as fish, poultry, beans, and nuts to support tissue growth and repair; 4) Healthy fats from sources like olive oil, avocados, and nuts for heart health; and 5) Limited intake of added sugars, sodium, and unhealthy fats. Hydration is also crucial—aim for 8 cups of water daily. Individual nutritional needs vary based on age, sex, activity level, and health conditions, so consider consulting with a registered dietitian for personalized advice."
      : "Una dieta balanceada es fundamental para una buena salud. Los componentes clave incluyen: 1) Frutas y verduras (busca que ocupen la mitad de tu plato), que proporcionan vitaminas esenciales, minerales y fibra; 2) Granos integrales como arroz integral, avena y pan integral para energía y fibra adicional; 3) Proteínas magras como pescado, aves, frijoles y nueces para apoyar el crecimiento y reparación de tejidos; 4) Grasas saludables de fuentes como aceite de oliva, aguacates y nueces para la salud del corazón; y 5) Ingesta limitada de azúcares añadidos, sodio y grasas no saludables. La hidratación también es crucial—intenta beber 8 vasos de agua diariamente. Las necesidades nutricionales individuales varían según la edad, sexo, nivel de actividad y condiciones de salud, así que considera consultar con un dietista registrado para obtener consejos personalizados.";
  }

  // Heart Health Topics
  if (lowerQuery.includes("heart") || lowerQuery.includes("cardiac") || lowerQuery.includes("cardiovascular") || 
      lowerQuery.includes("corazón") || lowerQuery.includes("cardíaco") || lowerQuery.includes("cardiovascular")) {
    return language === "en"
      ? "Heart health is influenced by multiple factors including diet, physical activity, stress management, and avoiding tobacco. A heart-healthy diet emphasizes fruits, vegetables, whole grains, lean proteins, and healthy fats while limiting sodium, added sugars, and unhealthy fats. Regular physical activity—at least 150 minutes of moderate exercise weekly—helps maintain a healthy heart. Managing blood pressure is critical; ideal blood pressure is below 120/80 mm Hg. High cholesterol can lead to plaque buildup in arteries, so aim for total cholesterol below 200 mg/dL. If you have risk factors such as family history, diabetes, or are over 45 (men) or 55 (women), regular screenings are particularly important. Always consult with healthcare providers for personalized heart health advice."
      : "La salud del corazón está influenciada por múltiples factores, incluyendo la dieta, la actividad física, el manejo del estrés y evitar el tabaco. Una dieta saludable para el corazón enfatiza frutas, verduras, granos integrales, proteínas magras y grasas saludables, mientras limita el sodio, azúcares añadidos y grasas no saludables. La actividad física regular—al menos 150 minutos de ejercicio moderado semanalmente—ayuda a mantener un corazón saludable. Manejar la presión arterial es crucial; la presión arterial ideal es inferior a 120/80 mm Hg. El colesterol alto puede llevar a la acumulación de placa en las arterias, así que busca mantener el colesterol total por debajo de 200 mg/dL. Si tienes factores de riesgo como antecedentes familiares, diabetes, o tienes más de 45 años (hombres) o 55 años (mujeres), los exámenes regulares son particularmente importantes. Siempre consulta con proveedores de atención médica para obtener consejos personalizados sobre la salud del corazón.";
  }
  
  // Headache and Pain Management
  if (lowerQuery.includes("headache") || lowerQuery.includes("dolor de cabeza") || 
      lowerQuery.includes("migraine") || lowerQuery.includes("migraña")) {
    return language === "en"
      ? "Headaches can be classified into several types, including tension headaches (most common), migraines, and cluster headaches. Common triggers include stress, dehydration, poor sleep, certain foods, and environmental factors. For occasional tension headaches, over-the-counter pain relievers like acetaminophen or ibuprofen may help, alongside rest, hydration, and stress management techniques. Migraines, which can cause throbbing pain, sensitivity to light and sound, and sometimes nausea, may require prescription medications. Maintaining a headache diary can help identify personal triggers. If you experience frequent or severe headaches, new or changing headache patterns, or headaches with concerning symptoms like fever, stiff neck, or neurological changes, consult a healthcare provider promptly."
      : "Los dolores de cabeza pueden clasificarse en varios tipos, incluyendo dolores de cabeza por tensión (los más comunes), migrañas y dolores de cabeza en racimo. Los desencadenantes comunes incluyen estrés, deshidratación, mal sueño, ciertos alimentos y factores ambientales. Para dolores de cabeza ocasionales por tensión, analgésicos de venta libre como acetaminofén o ibuprofeno pueden ayudar, junto con descanso, hidratación y técnicas de manejo del estrés. Las migrañas, que pueden causar dolor pulsátil, sensibilidad a la luz y al sonido, y a veces náuseas, pueden requerir medicamentos recetados. Mantener un diario de dolores de cabeza puede ayudar a identificar desencadenantes personales. Si experimentas dolores de cabeza frecuentes o severos, patrones nuevos o cambiantes de dolor de cabeza, o dolores de cabeza con síntomas preocupantes como fiebre, rigidez en el cuello o cambios neurológicos, consulta a un proveedor de atención médica de inmediato.";
  }
  
  // Sleep Health Topics
  if (lowerQuery.includes("sleep") || lowerQuery.includes("insomnia") || lowerQuery.includes("dormir") || lowerQuery.includes("insomnio")) {
    return language === "en"
      ? "Quality sleep is essential for physical and mental health. Most adults need 7-9 hours of sleep per night. Good sleep hygiene practices include: maintaining a consistent sleep schedule; creating a dark, quiet, and cool sleeping environment; limiting screen time before bed; avoiding caffeine, alcohol, and large meals close to bedtime; and engaging in regular physical activity (but not too close to bedtime). Common sleep disorders include insomnia (difficulty falling or staying asleep), sleep apnea (interrupted breathing during sleep), and restless legs syndrome. If you consistently struggle with sleep despite good sleep hygiene, consider speaking with a healthcare provider. Chronic sleep problems can contribute to health issues such as high blood pressure, diabetes, depression, and impaired immune function."
      : "El sueño de calidad es esencial para la salud física y mental. La mayoría de los adultos necesitan 7-9 horas de sueño por noche. Las buenas prácticas de higiene del sueño incluyen: mantener un horario de sueño constante; crear un ambiente para dormir oscuro, tranquilo y fresco; limitar el tiempo de pantalla antes de acostarse; evitar la cafeína, el alcohol y las comidas abundantes cerca de la hora de acostarse; y realizar actividad física regular (pero no demasiado cerca de la hora de acostarse). Los trastornos del sueño comunes incluyen insomnio (dificultad para conciliar o mantener el sueño), apnea del sueño (respiración interrumpida durante el sueño) y síndrome de piernas inquietas. Si constantemente tienes problemas con el sueño a pesar de una buena higiene del sueño, considera hablar con un proveedor de atención médica. Los problemas crónicos de sueño pueden contribuir a problemas de salud como presión arterial alta, diabetes, depresión y función inmunológica deteriorada.";
  }
  
  // Stress Management
  if (lowerQuery.includes("stress") || lowerQuery.includes("anxiety") || lowerQuery.includes("estrés") || lowerQuery.includes("ansiedad")) {
    return language === "en"
      ? "Stress is a natural response to demanding situations, but chronic stress can negatively impact both physical and mental health. Effective stress management strategies include: regular physical activity, which can reduce stress hormones and release endorphins; mindfulness and meditation practices to focus on the present moment; deep breathing exercises to activate the body's relaxation response; maintaining social connections, as social support is linked to better stress resilience; ensuring adequate sleep and nutrition; time management techniques to reduce overwhelm; and setting boundaries to protect your time and energy. If stress becomes overwhelming or is accompanied by symptoms of anxiety or depression, professional support from a mental health provider can be beneficial. Remember that managing stress is an ongoing practice rather than a one-time solution."
      : "El estrés es una respuesta natural a situaciones exigentes, pero el estrés crónico puede impactar negativamente tanto la salud física como mental. Las estrategias efectivas de manejo del estrés incluyen: actividad física regular, que puede reducir las hormonas del estrés y liberar endorfinas; prácticas de atención plena y meditación para enfocarse en el momento presente; ejercicios de respiración profunda para activar la respuesta de relajación del cuerpo; mantener conexiones sociales, ya que el apoyo social está vinculado a una mejor resiliencia al estrés; asegurar un sueño y nutrición adecuados; técnicas de administración del tiempo para reducir la sobrecarga; y establecer límites para proteger tu tiempo y energía. Si el estrés se vuelve abrumador o está acompañado de síntomas de ansiedad o depresión, el apoyo profesional de un proveedor de salud mental puede ser beneficioso. Recuerda que manejar el estrés es una práctica continua en lugar de una solución única.";
  }

  // Exercise Topics
  if (lowerQuery.includes("exercise") || lowerQuery.includes("workout") || lowerQuery.includes("ejercicio") || lowerQuery.includes("entrenamiento")) {
    return language === "en"
      ? "Regular physical activity is one of the most important things you can do for your health. Adults should aim for at least 150 minutes of moderate-intensity aerobic activity (like brisk walking) or 75 minutes of vigorous activity (like running) weekly, plus muscle-strengthening activities on 2 or more days per week. Benefits of regular exercise include improved cardiovascular health, stronger muscles and bones, better weight management, reduced risk of chronic diseases, improved mental health, better sleep, and enhanced cognitive function. If you're new to exercise, start gradually and increase intensity and duration over time. Choose activities you enjoy to help maintain consistency. Always warm up before exercise and cool down afterward. If you have health concerns or chronic conditions, consult with a healthcare provider before starting a new exercise program."
      : "La actividad física regular es una de las cosas más importantes que puedes hacer por tu salud. Los adultos deben buscar al menos 150 minutos de actividad aeróbica de intensidad moderada (como caminar rápido) o 75 minutos de actividad vigorosa (como correr) semanalmente, más actividades de fortalecimiento muscular en 2 o más días por semana. Los beneficios del ejercicio regular incluyen mejor salud cardiovascular, músculos y huesos más fuertes, mejor control de peso, reducción del riesgo de enfermedades crónicas, mejor salud mental, mejor sueño y mejor función cognitiva. Si eres nuevo en el ejercicio, comienza gradualmente y aumenta la intensidad y duración con el tiempo. Elige actividades que disfrutes para ayudar a mantener la consistencia. Siempre calienta antes del ejercicio y enfría después. Si tienes problemas de salud o condiciones crónicas, consulta con un proveedor de atención médica antes de comenzar un nuevo programa de ejercicios.";
  }

  // Diabetes Information
  if (lowerQuery.includes("diabetes") || lowerQuery.includes("blood sugar") || lowerQuery.includes("azúcar en sangre")) {
    return language === "en"
      ? "Diabetes is a chronic condition that affects how your body turns food into energy. There are several types, with Type 1, Type 2, and gestational diabetes being the most common. In all types, your body either doesn't make enough insulin or can't use it as well as it should. Symptoms may include increased thirst and urination, fatigue, blurred vision, and slow-healing sores. Risk factors for Type 2 diabetes include being overweight, physical inactivity, family history, and age over 45. Management typically involves monitoring blood sugar, medication or insulin therapy if prescribed, regular physical activity, and a balanced diet with consistent carbohydrate intake. Regular check-ups are important to monitor for complications affecting the eyes, kidneys, nerves, and heart. If you notice symptoms or have risk factors, consult with a healthcare provider for proper diagnosis and treatment."
      : "La diabetes es una condición crónica que afecta cómo tu cuerpo convierte los alimentos en energía. Hay varios tipos, siendo la diabetes Tipo 1, Tipo 2 y gestacional los más comunes. En todos los tipos, tu cuerpo no produce suficiente insulina o no puede usarla tan bien como debería. Los síntomas pueden incluir aumento de sed y micción, fatiga, visión borrosa y heridas de curación lenta. Los factores de riesgo para la diabetes Tipo 2 incluyen sobrepeso, inactividad física, antecedentes familiares y edad mayor de 45 años. El manejo típicamente involucra monitoreo del azúcar en sangre, medicación o terapia con insulina si es prescrita, actividad física regular y una dieta balanceada con ingesta consistente de carbohidratos. Los chequeos regulares son importantes para monitorear complicaciones que afectan los ojos, riñones, nervios y corazón. Si notas síntomas o tienes factores de riesgo, consulta con un proveedor de atención médica para un diagnóstico y tratamiento adecuados.";
  }
  
  // Default response if no specific topic is matched
  return language === "en"
    ? "I can provide general health information on topics such as nutrition, exercise, sleep, stress management, heart health, diabetes, headaches, and mental health conditions like anxiety and depression. Please ask a specific health question, and I'll do my best to provide helpful information based on current medical guidelines. Remember that while I can offer general guidance, I can't provide personalized medical advice. For specific health concerns, please consult with a qualified healthcare provider."
    : "Puedo proporcionar información general sobre salud en temas como nutrición, ejercicio, sueño, manejo del estrés, salud del corazón, diabetes, dolores de cabeza y condiciones de salud mental como ansiedad y depresión. Por favor, haz una pregunta específica sobre salud, y haré lo mejor para proporcionar información útil basada en las pautas médicas actuales. Recuerda que aunque puedo ofrecer orientación general, no puedo proporcionar consejos médicos personalizados. Para preocupaciones específicas de salud, por favor consulta con un proveedor de atención médica calificado.";
};

// Simplified functions that replace the LLM functionality
export const isOfflineModelReady = (): boolean => false;
export const initOfflineModel = async (): Promise<boolean> => true;
export const getOfflineModelConfig = () => ({ modelName: "Simulated Model", isLoaded: true });
export const generateOfflineResponse = async (query: string, language: "en" | "es" = "en"): Promise<string> => {
  return getSampleResponse(query, language);
};
