// script.js

document.getElementById('redirect-btn').addEventListener('click', function () {
  alert('-> ¡Su paquete de GUÍA + Ruta Turística ha sido creado con ÉXITO!\n-> Enviamos toda la información a su dirección de correo electrónico.\n-> GRACIAS por utilizar TourMasters!');
  window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const navLinks = document.querySelectorAll('.navbar a');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const form = document.getElementById('multiStepForm');
    
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });

        navLinks.forEach((link, index) => {
            link.classList.toggle('active', index === stepIndex);
        });

        if (stepIndex === steps.length - 1) {
            updateReview();
        }
    }

    function updateReview() {
        document.getElementById('review-name').textContent = document.getElementById('name').value;
        document.getElementById('review-viajan').textContent = document.getElementById('viajan').value;
        document.getElementById('review-idioma').textContent = document.getElementById('idioma').value;
        document.getElementById('review-routeSelect').textContent = document.getElementById('routeSelect').value;

        document.getElementById('review-email').textContent = document.getElementById('email').value;
        document.getElementById('review-age').textContent = document.getElementById('age').value;
        
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const stepIndex = parseInt(link.getAttribute('data-step')) - 1;
            currentStep = stepIndex;
            showStep(currentStep);
        });
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextStep = parseInt(button.getAttribute('data-next')) - 1;
            currentStep = nextStep;
            showStep(currentStep);
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prevStep = parseInt(button.getAttribute('data-prev')) - 1;
            currentStep = prevStep;
            showStep(currentStep);
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Formulario enviado!');
    });

    showStep(currentStep);
});

function updateMap() {
    var select = document.getElementById("routeSelect");
    var iframe = document.getElementById("mapFrame");
    var description = document.getElementById("description");

    var routes = {
        "Vuelta Casa de Uco": {
            mapUrl:"https://www.alltrails.com/es/widget/trail/argentina/mendoza/vuelta-casa-de-uco?elevationDiagram=false&u=m&sh=yshcdu",
            text: "El Valle de Uco es uno de las principales regiones vitivinícolas de la provincia de Mendoza. Esta vuelta te lleva a conocer una pequeña parte del valle en cercanías de la Casa de Uco, un hotel y viñedo ubicado al oeste de la ciudad de Tunuyán sobre la RP94. Esta es una zona árida, ideal para la producción de uvas."
        },
        "Tunuyan-Vista flores-Colonia Las Rosas": {
            mapUrl: "https://www.alltrails.com/es/widget/trail/argentina/mendoza/tunuyan-vista-flores-colonia-las-rosas?elevationDiagram=false&u=m&sh=yshcdu" ,
            text: "Sal a esta ruta circular de 42,0-km cerca de Tunuyán, Mendoza (Provincia). Por lo general, se considera una ruta moderada. Esta ruta es excelente para el ciclismo en carretera, y es poco probable encontrarse con otras personas mientras se recorre."
        },
        "Sendero Club de Pesca": {
            mapUrl : "https://www.alltrails.com/es/widget/trail/argentina/mendoza/sendero-club-de-pesca?elevationDiagram=false&u=m&sh=yshcdu",
            text : "Disfruta esta ruta de ida y vuelta de 4,5-km cerca de Tunuyán, Mendoza (Provincia). Por lo general, se considera una ruta moderada, que se tarda una media de 59 min en recorrer. Esta ruta es excelente para MTB, correr y pasear, y es poco probable encontrarse con otras personas mientras se recorre."
        }
    };


    var selectedRoute = select.value;

    if (routes[selectedRoute]) {
        iframe.src = routes[selectedRoute].mapUrl;
        description.innerHTML = routes[selectedRoute].text;
    } else {
        iframe.src = "";
        description.innerHTML = "";
    }
}

/*pagos.js*/
const mp = new MercadoPago('TU_PUBLIC_KEY', {
    locale: 'es-AR'
  });

  const cardForm = mp.cardForm({
    amount: '100.00',
    autoMount: true,
    form: {
      id: 'payment-form',
      cardholderName: {
        id: 'form-checkout__cardholderName',
      },
      cardholderEmail: {
        id: 'form-checkout__cardholderEmail',
      },
      cardNumber: {
        id: 'form-checkout__cardNumber',
      },
      cardExpirationMonth: {
        id: 'form-checkout__cardExpirationMonth',
      },
      cardExpirationYear: {
        id: 'form-checkout__cardExpirationYear',
      },
      securityCode: {
        id: 'form-checkout__securityCode',
      },
      installments: {
        id: 'form-checkout__installments',
      },
      identificationType: {
        id: 'form-checkout__identificationType',
      },
      identificationNumber: {
        id: 'form-checkout__identificationNumber',
      },
      issuer: {
        id: 'form-checkout__issuer',
      },
    },
    callbacks: {
      onFormMounted: error => {
        if (error) return console.warn('Form Mounted handling error: ', error);
        console.log('Form mounted');
      },
      onSubmit: event => {
        event.preventDefault();

        const {
          paymentMethodId,
          issuerId,
          cardholderEmail: email,
          amount,
          token,
          installments,
          identificationNumber,
          identificationType
        } = cardForm.getCardFormData();

        fetch('/process_payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            issuer_id: issuerId,
            payment_method_id: paymentMethodId,
            transaction_amount: Number(amount),
            installments: Number(installments),
            description: 'Descripción del producto',
            payer: {
              email,
              identification: {
                type: identificationType,
                number: identificationNumber
              }
            }
          }),
        })
        .then(response => response.json())
        .then(result => {
          if (result.error) {
            alert(`Error: ${result.error.message}`);
          } else {
            alert('Pago realizado con éxito');
          }
        })
        .catch(error => console.error('Error:', error));
      },
    },
  });