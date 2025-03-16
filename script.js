// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDZonP-urMIYnpzgW5lSmdLTaKbDgoQPW4",
    authDomain: "votaciones-derbis.firebaseapp.com",
    projectId: "votaciones-derbis",
    storageBucket: "votaciones-derbis.appspot.com",
    messagingSenderId: "773476840724",
    appId: "1:773476840724:web:3ef175879ef4ddfc223e01",
    measurementId: "G-R41GPJHW74"
  };
  
  // Inicializa Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore(); // Inicializa Firestore
  
  // Cargar las preguntas al cargar la página
  document.addEventListener('DOMContentLoaded', async () => {
      const questionContainer = document.getElementById('question-container');
  
      try {
          console.log("Cargando preguntas desde Firestore...");
  
          // Obtener las preguntas desde Firestore
          const querySnapshot = await db.collection('rivalidades').get();
  
          // Verificar si hay documentos
          if (querySnapshot.empty) {
              console.log("No se encontraron documentos en la colección 'rivalidades'.");
              return;
          }
  
          // Mostrar cada pregunta en la interfaz
          querySnapshot.forEach(doc => {
              const question = doc.data();
              console.log("Documento obtenido:", doc.id, question);
  
              const questionElement = document.createElement('div');
              questionElement.className = 'question';
              questionElement.innerHTML = `
                  <p>¿Quién prefieres?</p>
                  <div class="options">
                      <div class="option" onclick="vote('${doc.id}', 'A')">
                          <img src="${question.foto_a}" alt="${question.equipo_a}">
                          <p>${question.equipo_a}</p>
                      </div>
                      <div class="option" onclick="vote('${doc.id}', 'B')">
                          <img src="${question.foto_b}" alt="${question.equipo_b}">
                          <p>${question.equipo_b}</p>
                      </div>
                  </div>
              `;
              questionContainer.appendChild(questionElement);
          });
  
          console.log("Preguntas cargadas correctamente.");
      } catch (error) {
          console.error("Error cargando preguntas:", error);
      }
  });
  
  // Función para manejar los votos
  async function vote(questionId, option) {
      try {
          console.log(`Votando por la opción ${option} en la pregunta ${questionId}`);
  
          const questionRef = db.collection('rivalidades').doc(questionId);
          const questionDoc = await questionRef.get();
          const question = questionDoc.data();
  
          // Actualizar los votos en Firestore
          if (option === 'A') {
              await questionRef.update({ votos_a: question.votos_a + 1 });
          } else {
              await questionRef.update({ votos_b: question.votos_b + 1 });
          }
  
          alert('Voto registrado');
      } catch (error) {
          console.error("Error registrando el voto:", error);
          alert('Error al votar');
      }
  }