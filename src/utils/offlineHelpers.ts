// This is a simplified implementation of offline capabilities for the health assistant

// Define the OfflineModeType as a proper TypeScript type with literal types
export type OfflineModeType = "simulated" | "localLLM";

/**
 * Simple function to check if an offline model is ready - this is just a stub
 * In a real implementation, this would check if the model is loaded
 */
export function isOfflineModelReady(): boolean {
  return true;
}

/**
 * Stub function to initialize an offline model - in a real implementation, 
 * this would load the model into memory
 */
export async function initOfflineModel(): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
}

/**
 * Get configuration for the offline model - just a stub
 */
export function getOfflineModelConfig() {
  return {
    name: "health-assistant-offline",
    ready: true,
    size: "240MB"
  };
}

/**
 * Generate a response using an offline model - this is a stub
 * In a real implementation, this would use a local model to generate responses
 */
export async function generateOfflineResponse(prompt: string, language: "en" | "es"): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return getSampleResponse(prompt, language);
}

/**
 * Returns sample responses for common health topics based on keywords in the input
 * This function simulates AI responses without using any external API
 */
export function getSampleResponse(input: string, language: "en" | "es" = "en"): string {
  const lowerInput = input.toLowerCase();
  
  // Check for pediatric-related keywords
  if (containsAny(lowerInput, ['child', 'infant', 'baby', 'toddler', 'kid', 'pediatric', 'niño', 'bebé', 'infantil', 'pediátrico'])) {
    return getPediatricResponse(lowerInput, language);
  }
  
  // Check for nutrition-related keywords
  if (containsAny(lowerInput, ['nutrition', 'diet', 'food', 'eat', 'nutrición', 'dieta', 'comida', 'alimentación'])) {
    return getNutritionResponse(lowerInput, language);
  }
  
  // Check for exercise-related keywords
  if (containsAny(lowerInput, ['exercise', 'workout', 'fitness', 'active', 'ejercicio', 'entrenamiento', 'actividad física'])) {
    return getExerciseResponse(lowerInput, language);
  }
  
  // Check for sleep-related keywords
  if (containsAny(lowerInput, ['sleep', 'insomnia', 'rest', 'nap', 'sueño', 'insomnio', 'descanso', 'siesta'])) {
    return getSleepResponse(lowerInput, language);
  }
  
  // Check for stress-related keywords
  if (containsAny(lowerInput, ['stress', 'anxiety', 'worried', 'estrés', 'ansiedad', 'preocupado'])) {
    return getStressResponse(lowerInput, language);
  }
  
  // Check for heart-related keywords
  if (containsAny(lowerInput, ['heart', 'blood pressure', 'cholesterol', 'corazón', 'presión arterial', 'colesterol'])) {
    return getHeartResponse(lowerInput, language);
  }
  
  // Check for diabetes-related keywords
  if (containsAny(lowerInput, ['diabetes', 'sugar', 'glucose', 'azúcar', 'glucosa'])) {
    return getDiabetesResponse(lowerInput, language);
  }
  
  // Check for headache-related keywords
  if (containsAny(lowerInput, ['headache', 'migraine', 'dolor de cabeza', 'migraña'])) {
    return getHeadacheResponse(lowerInput, language);
  }
  
  // Check for mental health related keywords
  if (containsAny(lowerInput, ['mental health', 'depression', 'sad', 'salud mental', 'depresión', 'triste'])) {
    return getMentalHealthResponse(lowerInput, language);
  }
  
  // Default response if no specific topic is detected
  return language === "en" 
    ? "I'm here to provide general health information. Could you tell me more about what health topic you're interested in? For example, I can help with nutrition, exercise, sleep, stress management, heart health, diabetes, headaches, mental health, or pediatric health topics."
    : "Estoy aquí para proporcionar información general sobre salud. ¿Podrías contarme más sobre qué tema de salud te interesa? Por ejemplo, puedo ayudarte con nutrición, ejercicio, sueño, manejo del estrés, salud del corazón, diabetes, dolores de cabeza, salud mental, o temas de salud pediátrica.";
}

function getPediatricResponse(input: string, language: "en" | "es"): string {
  // Child development and growth
  if (containsAny(input, ['development', 'milestone', 'growth', 'desarrollo', 'hito', 'crecimiento'])) {
    return language === "en"
      ? "Child development milestones vary, but generally include: holding head up (2-4 months), sitting unassisted (6-8 months), crawling (7-10 months), walking (9-15 months), and first words (11-14 months). Remember that every child develops at their own pace. If you have concerns about your child's development, it's best to consult with their pediatrician for personalized guidance."
      : "Los hitos del desarrollo infantil varían, pero generalmente incluyen: sostener la cabeza (2-4 meses), sentarse sin ayuda (6-8 meses), gatear (7-10 meses), caminar (9-15 meses), y primeras palabras (11-14 meses). Recuerde que cada niño se desarrolla a su propio ritmo. Si tiene preocupaciones sobre el desarrollo de su hijo, es mejor consultar con su pediatra para obtener orientación personalizada.";
  }
  
  // Infant feeding
  if (containsAny(input, ['feeding', 'breastfeeding', 'formula', 'alimentación', 'lactancia', 'fórmula'])) {
    return language === "en"
      ? "For infants, breast milk or formula is recommended as the primary source of nutrition for the first 6 months. Around 6 months, you can begin introducing solid foods while continuing breast milk or formula. Start with single-ingredient foods without added sugar or salt, and introduce new foods one at a time to watch for allergic reactions. Always consult your pediatrician for specific feeding recommendations for your child."
      : "Para bebés, se recomienda la leche materna o fórmula como fuente principal de nutrición durante los primeros 6 meses. Alrededor de los 6 meses, puede comenzar a introducir alimentos sólidos mientras continúa con leche materna o fórmula. Comience con alimentos de un solo ingrediente sin azúcar o sal añadidos, e introduzca nuevos alimentos de uno en uno para observar reacciones alérgicas. Siempre consulte a su pediatra para recomendaciones específicas de alimentación para su hijo.";
  }
  
  // Childhood vaccinations
  if (containsAny(input, ['vaccine', 'vaccination', 'immunization', 'shot', 'vacuna', 'vacunación', 'inmunización', 'inyección'])) {
    return language === "en"
      ? "Childhood vaccinations are an important part of preventive healthcare. The recommended schedule includes vaccines for diseases like measles, mumps, rubella, polio, whooping cough, and others. Vaccines help protect not only your child but also others in the community through herd immunity. Your pediatrician can provide the specific vaccination schedule appropriate for your child's age and medical history."
      : "Las vacunas infantiles son una parte importante de la atención médica preventiva. El calendario recomendado incluye vacunas para enfermedades como sarampión, paperas, rubéola, polio, tos ferina y otras. Las vacunas ayudan a proteger no solo a su hijo sino también a otros en la comunidad a través de la inmunidad colectiva. Su pediatra puede proporcionar el calendario de vacunación específico apropiado para la edad e historial médico de su hijo.";
  }
  
  // Childhood illnesses
  if (containsAny(input, ['fever', 'cold', 'flu', 'ear infection', 'fiebre', 'resfriado', 'gripe', 'infección de oído'])) {
    return language === "en"
      ? "Common childhood illnesses include colds, ear infections, sore throats, and stomach bugs. For fevers, a temperature of 100.4°F (38°C) or higher is considered significant in children. Contact your pediatrician if your child has a high fever, especially in babies under 3 months, if the fever lasts more than 2-3 days, or if your child appears very ill or unusually drowsy. Always consult a healthcare provider for proper diagnosis and treatment of childhood illnesses."
      : "Las enfermedades infantiles comunes incluyen resfriados, infecciones de oído, dolor de garganta y problemas estomacales. Para fiebres, una temperatura de 38°C (100.4°F) o más se considera significativa en niños. Contacte a su pediatra si su hijo tiene fiebre alta, especialmente en bebés menores de 3 meses, si la fiebre dura más de 2-3 días, o si su hijo parece muy enfermo o inusualmente somnoliento. Siempre consulte a un proveedor de atención médica para el diagnóstico y tratamiento adecuados de enfermedades infantiles.";
  }
  
  // Sleep for children
  if (containsAny(input, ['sleep', 'bedtime', 'nap', 'sueño', 'hora de dormir', 'siesta'])) {
    return language === "en"
      ? "Sleep needs vary by age: newborns (0-3 months) need 14-17 hours, infants (4-11 months) need 12-15 hours, toddlers (1-2 years) need 11-14 hours, preschoolers (3-5) need 10-13 hours, and school-age children (6-13) need 9-11 hours of sleep daily. Consistent bedtime routines help signal to children that it's time to sleep. If your child has persistent sleep problems, consult with their pediatrician."
      : "Las necesidades de sueño varían según la edad: los recién nacidos (0-3 meses) necesitan 14-17 horas, los bebés (4-11 meses) necesitan 12-15 horas, los niños pequeños (1-2 años) necesitan 11-14 horas, los preescolares (3-5) necesitan 10-13 horas, y los niños en edad escolar (6-13) necesitan 9-11 horas de sueño diariamente. Las rutinas consistentes a la hora de dormir ayudan a indicar a los niños que es hora de dormir. Si su hijo tiene problemas persistentes de sueño, consulte con su pediatra.";
  }
  
  // Childhood nutrition
  if (containsAny(input, ['nutrition', 'diet', 'food', 'eat', 'nutrición', 'dieta', 'comida', 'alimentación'])) {
    return language === "en"
      ? "A balanced diet for children should include fruits, vegetables, whole grains, lean proteins, and dairy products. Limit processed foods, sugary drinks, and high-sodium items. Children need regular meals and snacks for energy throughout the day. Be patient with picky eaters and continue offering a variety of healthy foods. If you have concerns about your child's nutrition or growth, consult with your pediatrician."
      : "Una dieta equilibrada para niños debe incluir frutas, verduras, granos integrales, proteínas magras y productos lácteos. Limite los alimentos procesados, bebidas azucaradas y productos con alto contenido de sodio. Los niños necesitan comidas y meriendas regulares para tener energía durante todo el día. Sea paciente con los niños quisquillosos con la comida y continúe ofreciendo una variedad de alimentos saludables. Si tiene preocupaciones sobre la nutrición o el crecimiento de su hijo, consulte con su pediatra.";
  }
  
  // Behavioral issues
  if (containsAny(input, ['behavior', 'tantrum', 'discipline', 'comportamiento', 'rabieta', 'disciplina'])) {
    return language === "en"
      ? "Children's behavioral challenges are a normal part of development. For tantrums, stay calm, ensure safety, and use simple language to acknowledge feelings. Consistent routines and clear expectations help children understand boundaries. Positive reinforcement for good behavior is more effective than punishment. If behavioral issues significantly impact daily life or you notice dramatic changes in behavior, consult your pediatrician or a child psychologist."
      : "Los desafíos de comportamiento de los niños son una parte normal del desarrollo. Para las rabietas, mantenga la calma, garantice la seguridad y use un lenguaje simple para reconocer los sentimientos. Las rutinas consistentes y expectativas claras ayudan a los niños a entender los límites. El refuerzo positivo para el buen comportamiento es más efectivo que el castigo. Si los problemas de comportamiento afectan significativamente la vida diaria o nota cambios dramáticos en el comportamiento, consulte a su pediatra o a un psicólogo infantil.";
  }
  
  // Default pediatric response
  return language === "en"
    ? "Pediatric health covers many aspects of children's wellbeing, from physical development and nutrition to vaccinations and common illnesses. Regular well-child visits with a pediatrician are important for monitoring growth, development, and addressing any concerns. For specific guidance about your child's health, please consult with their healthcare provider who can offer personalized recommendations based on your child's unique needs."
    : "La salud pediátrica abarca muchos aspectos del bienestar de los niños, desde el desarrollo físico y la nutrición hasta las vacunas y enfermedades comunes. Las visitas regulares de control con un pediatra son importantes para monitorear el crecimiento, desarrollo y abordar cualquier preocupación. Para orientación específica sobre la salud de su hijo, consulte con su proveedor de atención médica, quien puede ofrecer recomendaciones personalizadas basadas en las necesidades únicas de su hijo.";
}

// Existing response functions
function getNutritionResponse(input: string, language: "en" | "es"): string {
  return language === "en"
    ? "A balanced diet includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Try to limit processed foods, added sugars, and excessive salt. Stay hydrated by drinking plenty of water. For personalized nutrition advice, consider consulting with a registered dietitian who can provide guidance based on your specific health needs and goals."
    : "Una dieta equilibrada incluye una variedad de frutas, verduras, granos integrales, proteínas magras y grasas saludables. Trate de limitar los alimentos procesados, azúcares añadidos y sal excesiva. Manténgase hidratado bebiendo suficiente agua. Para consejos de nutrición personalizados, considere consultar con un dietista registrado que pueda proporcionar orientación basada en sus necesidades y objetivos de salud específicos.";
}

function getExerciseResponse(input: string, language: "en" | "es"): string {
  return language === "en"
    ? "Regular physical activity has numerous health benefits, including improved cardiovascular health, stronger muscles and bones, better weight management, and enhanced mental well-being. Adults should aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity each week, plus muscle-strengthening activities twice a week. Start gradually if you haven't been active and choose activities you enjoy to help maintain consistency."
    : "La actividad física regular tiene numerosos beneficios para la salud, incluyendo mejor salud cardiovascular, músculos y huesos más fuertes, mejor control de peso y bienestar mental mejorado. Los adultos deben tratar de hacer al menos 150 minutos de actividad aeróbica de intensidad moderada o 75 minutos de actividad vigorosa cada semana, más actividades de fortalecimiento muscular dos veces por semana. Comience gradualmente si no ha estado activo y elija actividades que disfrute para ayudar a mantener la consistencia.";
}

function getSleepResponse(input: string, language: "en" | "es"): string {
  return language === "en"
    ? "Quality sleep is essential for overall health and well-being. Most adults need 7-9 hours of sleep per night. To improve sleep, maintain a consistent sleep schedule, create a relaxing bedtime routine, ensure your bedroom is dark, quiet, and cool, limit exposure to screens before bed, avoid caffeine and alcohol close to bedtime, and stay physically active during the day. If you consistently have trouble sleeping, consider speaking with a healthcare provider."
    : "El sueño de calidad es esencial para la salud y el bienestar general. La mayoría de los adultos necesitan 7-9 horas de sueño por noche. Para mejorar el sueño, mantenga un horario de sueño constante, cree una rutina relajante antes de acostarse, asegúrese de que su dormitorio esté oscuro, tranquilo y fresco, limite la exposición a pantallas antes de acostarse, evite la cafeína y el alcohol cerca de la hora de dormir, y manténgase físicamente activo durante el día. Si constantemente tiene problemas para dormir, considere hablar con un proveedor de atención médica.";
}

function getStressResponse(input: string, language: "en" | "es"): string {
  return language === "en"
    ? "Managing stress is important for both mental and physical health. Effective stress management techniques include regular exercise, deep breathing exercises, meditation, progressive muscle relaxation, spending time in nature, connecting with supportive friends and family, engaging in enjoyable activities, and getting enough sleep. If stress is significantly impacting your daily life, consider speaking with a mental health professional who can provide additional strategies and support."
    : "Manejar el estrés es importante tanto para la salud mental como física. Las técnicas efectivas de manejo del estrés incluyen ejercicio regular, ejercicios de respiración profunda, meditación, relajación muscular progresiva, pasar tiempo en la naturaleza, conectarse con amigos y familiares que brindan apoyo, participar en actividades agradables y dormir lo suficiente. Si el estrés está impactando significativamente su vida diaria, considere hablar con un profesional de salud mental que pueda proporcionar estrategias y apoyo adicionales.";
}

function getHeartResponse(input: string, language: "en" | "es"): string {
  return language === "en"
    ? "Heart health can be improved through regular physical activity, a heart-healthy diet rich in fruits, vegetables, whole grains, and lean proteins, maintaining a healthy weight, not smoking, limiting alcohol, managing stress, and getting quality sleep. It's also important to monitor and control blood pressure, cholesterol, and blood sugar levels. Regular check-ups with your healthcare provider can help assess your cardiovascular health and identify risk factors early."
    : "La salud del corazón puede mejorarse mediante actividad física regular, una dieta saludable para el corazón rica en frutas, verduras, granos integrales y proteínas magras, manteniendo un peso saludable, no fumando, limitando el alcohol, manejando el estrés y durmiendo con calidad. También es importante monitorear y controlar la presión arterial, el colesterol y los niveles de azúcar en la sangre. Chequeos regulares con su proveedor de atención médica pueden ayudar a evaluar su salud cardiovascular e identificar factores de riesgo temprano.";
}

function getDiabetesResponse(input: string, language: "en" | "es"): string {
  return language === "en"
    ? "Managing diabetes involves monitoring blood glucose levels, taking medications as prescribed, following a balanced meal plan, regular physical activity, and attending scheduled healthcare appointments. A dietitian can help create a personalized meal plan that controls carbohydrate intake while providing adequate nutrition. If you have diabetes, it's important to also monitor for and manage related conditions like high blood pressure and high cholesterol. Regular check-ups with your healthcare team are essential for ongoing diabetes care."
    : "El manejo de la diabetes implica monitorear los niveles de glucosa en sangre, tomar medicamentos según lo prescrito, seguir un plan de comidas equilibrado, actividad física regular y asistir a citas médicas programadas. Un dietista puede ayudar a crear un plan de comidas personalizado que controle la ingesta de carbohidratos mientras proporciona nutrición adecuada. Si tiene diabetes, también es importante monitorear y manejar condiciones relacionadas como presión arterial alta y colesterol alto. Chequeos regulares con su equipo de atención médica son esenciales para el cuidado continuo de la diabetes.";
}

function getHeadacheResponse(input: string, language: "en" | "es"): string {
  return language === "en"
    ? "Headaches can have many causes, including stress, dehydration, lack of sleep, eye strain, poor posture, skipped meals, or certain foods and beverages. For occasional tension headaches, over-the-counter pain relievers, rest, cold or hot compresses, and relaxation techniques may help. If you experience severe, frequent, or unusual headaches, headaches that wake you from sleep, headaches with fever or stiff neck, or headaches following a head injury, seek medical attention promptly."
    : "Los dolores de cabeza pueden tener muchas causas, incluyendo estrés, deshidratación, falta de sueño, fatiga visual, mala postura, comidas omitidas, o ciertos alimentos y bebidas. Para dolores de cabeza tensionales ocasionales, analgésicos de venta libre, descanso, compresas frías o calientes, y técnicas de relajación pueden ayudar. Si experimenta dolores de cabeza severos, frecuentes o inusuales, dolores de cabeza que lo despiertan del sueño, dolores de cabeza con fiebre o rigidez en el cuello, o dolores de cabeza después de una lesión en la cabeza, busque atención médica de inmediato.";
}

function getMentalHealthResponse(input: string, language: "en" | "es"): string {
  return language === "en"
    ? "Mental health is as important as physical health. Practices that support mental wellbeing include regular physical activity, adequate sleep, stress management techniques, connecting with others, engaging in meaningful activities, and seeking help when needed. If you're experiencing persistent sadness, anxiety, changes in sleep or appetite, loss of interest in activities, or thoughts of harming yourself, it's important to reach out to a mental health professional. Many effective treatments exist for mental health conditions, including therapy, medication, and lifestyle changes."
    : "La salud mental es tan importante como la salud física. Las prácticas que apoyan el bienestar mental incluyen actividad física regular, sueño adecuado, técnicas de manejo del estrés, conexión con otros, participación en actividades significativas, y buscar ayuda cuando sea necesario. Si está experimentando tristeza persistente, ansiedad, cambios en el sueño o apetito, pérdida de interés en actividades, o pensamientos de hacerse daño, es importante contactar a un profesional de salud mental. Existen muchos tratamientos efectivos para condiciones de salud mental, incluyendo terapia, medicación y cambios en el estilo de vida.";
}

/**
 * Helper to check if input contains any of the given terms
 */
function containsAny(input: string, terms: string[]): boolean {
  return terms.some(term => input.includes(term));
}
