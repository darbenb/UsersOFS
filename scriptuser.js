//Método para traer la información del usuario

function getUser() {
    const login = document.getElementById('userId').value.trim();
  // Método GET para obtener la información del usuario
    fetch(`https://amx-co5.test.etadirect.com/rest/ofscCore/v1/users/${login}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic b3RjX2FwaUBhbXgtY281LnRlc3Q6ZjI0NDgyNjkxMWZjYzdmZmQwZGNiNjdjMGY0ODg5MzE1MjgzMzU1NmFkYTAzNzMxYTBhNjk0MTllYmY1'
      }
    })
    .then(response => response.json())
    .then(data => {
      
      document.getElementById('message').innerText = JSON.stringify(data, null, 2);
      document.getElementById('main-container').classList.add('response-align');
      document.getElementById('response-container').classList.remove('hidden');
      
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('message').innerText = 'Error al obtener la información del usuario. Verifica el Login.';
      document.getElementById('response-container').classList.add('hidden');
    });
  }
  
  function updateUser() {
    const login = document.getElementById('userId').value.trim();
    const newEmail = document.getElementById('uemail').value;

    if(!login) {
        Swal.fire('Debes ingresar un dato válido.', 'Verifica el Login. ','error');
        return;
    }
      
    // Método PATCH para actualizar el correo electrónico
    fetch(`https://amx-co5.test.etadirect.com/rest/ofscCore/v1/users/${login}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic b3RjX2FwaUBhbXgtY281LnRlc3Q6ZjI0NDgyNjkxMWZjYzdmZmQwZGNiNjdjMGY0ODg5MzE1MjgzMzU1NmFkYTAzNzMxYTBhNjk0MTllYmY1'
      },
      body: JSON.stringify({
        uemail: newEmail
      })
    })
   
   .then(response => {
      if (response.ok) {
        Swal.fire(
            'Actualización exitosa.',
            ('Correo: '+newEmail+ ' registrado.'),
            'success'
        );
        getUser(login.value);
        clearInfo();
        
      } else {
        Swal.fire('Error al actualizar.', 'Verifica el Login. '+response.status,'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire('Error inesperado. Inténtalo de nuevo.');
    });
  }

  function clearInfo() {
    document.getElementById('userId').value = '';
    document.getElementById('uemail').value = '';
    document.getElementById('message').innerText = '';
    document.getElementById('response-container').classList.add('hidden');
    document.getElementById('fileInput').value='';
    
  }
  
  //Función procesar archivo masivo
function executeMassive() {
    // Llama a la función que procesa el archivo
    processFile();
  
function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
  
        let processedCount = 0;
        let errorCount = 0;
  
        // Procesa cada línea del archivo
        lines.forEach(line => {
          const [login, email] = line.split(';');
  
          // Realiza la solicitud PATCH para cada registro
          fetch(`https://amx-co5.test.etadirect.com/rest/ofscCore/v1/users/${login}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic b3RjX2FwaUBhbXgtY281LnRlc3Q6ZjI0NDgyNjkxMWZjYzdmZmQwZGNiNjdjMGY0ODg5MzE1MjgzMzU1NmFkYTAzNzMxYTBhNjk0MTllYmY1'
            },
            body: JSON.stringify({
              uemail: email
            })
          })
          .then(response => {
            if (response.ok) {
              processedCount++;
            } else {
              errorCount++;
            }
  
            if (processedCount + errorCount === lines.length) {
              // Muestra un mensaje con el recuento de registros procesados y los que no
              Swal.fire('Procesamiento Completo', `Registros procesados: ${processedCount}\nRegistros con error: ${errorCount}`, 'success');
              document.getElementById('fileInput').value='';
            }
          })
          .catch(error => {
            console.error('Error:', error);
            errorCount++;
  
            if (processedCount + errorCount === lines.length) {
              // Muestra un mensaje con el recuento de registros procesados y los que no
              Swal.fire('Procesamiento Completo', `Registros procesados: ${processedCount}\nRegistros con error: ${errorCount}`, 'success');
            }
          });
        });
      };
  
      reader.readAsText(file);
    }
  }
}
  
  