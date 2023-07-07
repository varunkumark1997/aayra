// const assistantSection = document.getElementById('assistant');
const checkoutSection = document.getElementById('checkout');
const overlay = document.getElementById('overlay');
const message = document.createElement('p');

// const overlayText = document.getElementById("overlay-text");
const text = "Hello, world! This is a crazy font.";
// const overlayText = document.getElementById("overlay-text");

const overlayText = document.getElementById("overlay-text");

const textElement = document.getElementById("typing-text");


let stopSpeech = false;
let stopTransaction = false;

function typeWriter(text) {
  let index = 0;
  let typingInterval = setInterval(() => {
    if(stopSpeech) {
      index=0
      
      stopSpeech = true
      textElement.textContent = ''
      typeWriter(".........")
      clearInterval(typingInterval);
    }
    if (index < text.length) {
      textElement.textContent = text.substring(0, index + 1);
      index++;
    } else {
      // index=0
      // clearInterval(typingInterval);
    }
  }, 50);
}

function handleClick(message) {
  alert(message);
}

// Example usage
// typeWriter("Click me!");

// // You can change the text dynamically by calling typeWriter with a new text whenever needed
// setTimeout(() => {
//   typeWriter("Click me again!");
// }, 3000);



function showOption() {
  const confirmation = 1
    // assistantSection.style.display = 'block';
    blurScreen();

     typeWriter("Fetching your preferences, give us a moment")
    readOutLoud('Fetching your preferences, give us a moment')
      .then(makePreferencesCall)
      .catch(err => console.log(err));    
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function speakNRead(text, cb) {
  return function() {
    if(stopSpeech){ 
      typeWriter("") 
      return
    }
    typeWriter(text);
    readOutLoud(text, cb)
  }
}

function makePreferencesCall()
{
   const apiUrl = 'https://checkout-service-varun-k.dev.razorpay.in/v1/preferences?key_id=rzp_test_liZ1OYVeLii24n';
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return true;
      })
      .then(() => {
        if(stopSpeech) {
          return false
        }
        // typeWriter('preferences loaded successfuly')
    })
      .then(() => {
        if(!stopSpeech) {

          speakNRead('preferences loaded successfuly')

          amount = parseInt(document.getElementById('amount').value);

          console.log(typeof amount)

          if (amount === 101)
          {
              speakNRead('Your preferred UPI instrument is facing downtime',() => {
                 speakNRead('Initiating your preferred Visa card payment ending with 1 1 1 1...',()=>{
                cardPaymentData = generatePaymentData('card', '+919902529070', 'qa.testing@razorpay.com', '4444', 'INR', cardData);
              makePaymentAPICall(cardPaymentData,'card', 'https://api-web-varun-k.dev.razorpay.in/v1/payments/create/ajax?key_id=rzp_test_iFxtpfbj227eNO');
            })()
              })()

              return
          }

          if (amount > 1 && amount < 1000)
          {
              speakNRead('Initiating UPI payment at HDFC bank',)()
              data = generatePaymentData('upi', '+917204618088', 'vck173@gmail.com', '100', 'INR', upiData);

              makePaymentAPICall(data,'upi', 'https://api.razorpay.com/v1/payments/create/ajax?key_id=rzp_live_ILgsfZCZoFIKMb');
            }

            if (amount >= 1000)
            {
              speakNRead('Initiating your preferred Visa card payment ending with 1 1 1 1...',()=>{
                cardPaymentData = generatePaymentData('card', '+919902529070', 'qa.testing@razorpay.com', '4444', 'INR', cardData);
              makePaymentAPICall(cardPaymentData,'card', 'https://api-web-varun-k.dev.razorpay.in/v1/payments/create/ajax?key_id=rzp_test_iFxtpfbj227eNO');
            })()
              
    
            }
      
          // readOutLoud("Payment Successful, redirecting to merchant site")
        }
      })
      .catch(error => {
        debugger;
        console.error('Error:', error);
        message.textContent = 'Error fetching preferences.';
      })
}

    // typeWriter('Initiating payment with U P I')

function blurScreen() {
  overlay.style.display = 'flex';
}

// Rest of the code for speech recognition and text-to-speech functionality...

function hideOverlay() {
  overlay.style.display = 'none';
  // assistantSection.style.display = 'none';
  checkoutSection.style.display = 'block';
}

function makePaymentAPICall(formData, method, apiUrl) {
  // const apiUrl = 'https://api.razorpay.com/v1/payments/create/ajax?key_id=rzp_live_ILgsfZCZoFIKMb';
  const headers = {
    'Accept': '/',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (stopTransaction ) throw new Error('Something went wrong.');
      // Call separate functions for response handling based on the method
      if (method === 'upi') {
        handleUPIResponse(data);
      } else if (method === 'card') {
        setTimeout(function() {
          handleCardResponse(data)
        }, 1000)
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function generatePaymentData(method, contact, email1, amount1, currency1, additionalData = {}) {
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  amount = document.getElementById('amount').value;
  const currency = 'INR'

  if (email1 === "axis")
  {
    amount = 3333
  }
  const data = {
    contact: encodeURIComponent(contact),
    email: encodeURIComponent(email),
    method: method,
    amount: encodeURIComponent(amount),
    currency: currency
  };

  // Merge additional data based on the method
  if (method === 'card') {
    const { number, cvv, name, expiry_month, expiry_year } = additionalData.card;
    data['card[number]'] = encodeURIComponent(number);
    data['card[cvv]'] = encodeURIComponent(cvv);
    data['card[name]'] = encodeURIComponent(name);
    data['card[expiry_month]'] = encodeURIComponent('12');
    data['card[expiry_year]'] = encodeURIComponent('27');
  } else if (method === 'upi') {
    const { vpa, save, flow } = additionalData.upi;
    data.vpa = encodeURIComponent(vpa);
    data.save = encodeURIComponent(save);
    data['upi[flow]'] = encodeURIComponent(flow);
    data['force_terminal_id']=encodeURIComponent("term_Ky2EKzBkq6LriK")
  }

  // Construct the form data string
  const formData = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return formData;
}

const cardData = {
  card: {
    number: '4111111111111111',
    cvv: '123',
    name: 'QARazorpay',
    expiry_month: '11',
    expiry_year: '23'
  }
};

// const cardPaymentData = generatePaymentData('card', '+919902529070', 'qa.testing@razorpay.com', '900000', 'INR', cardData);
// console.log(cardPaymentData);

const upiData = {
  upi: {
    vpa: 'vck173@okhdfcbank',
    save: '1',
    flow: 'collect'
  }
};

// const upiPaymentData = generatePaymentData('upi', '+917204618088', 'vck173@gmail.com', '100', 'INR', upiData);
// console.log(upiPaymentData);

function handleCardResponse(data) {
  
  console.log(data)
  // sleep(10000)
  const submitUrl = data.submit_url;
  const otp = '0007'; // Replace with the actual OTP value

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `otp=${otp}`
  };
// sleep(10000)

  speakNRead("Reading OTP * * * *", 
    typeWriter("........."))()
// sleep(10000)  


  fetch(submitUrl, requestOptions)
    .then(response => response.json())
    .then(data => {
      

      console.log('OTP submitted:', data);
      if (stopTransaction ) throw new Error('Something went wrong.');
      if (typeof data.error !== "undefined")
      {
        console.log(data.error.description)
        readOutLoud(data.error.description)
        typeWriter("Payment Failed, please retry")


        // retry with UPI Option

        speakNRead("Failure is not an option @ Razorpay :P ")()

        // setTimeout(()=>{
        //   speakNRead('Initiating UPI payment at HDFC bank',()=>{
        //       data = generatePaymentData('upi', '+917204618088', 'vck173@gmail.com', '100', 'INR', upiData);

        //       makePaymentAPICall(data,'upi', 'https://api.razorpay.com/v1/payments/create/ajax?key_id=rzp_live_ILgsfZCZoFIKMb')})()

        //       return
        // }, 2000)

        // res();
      // Handle the response after OTP submission
      }else{
         setTimeout(function() {
         displayPaymentSuccess(data, 'card')
        }, 3000)
        
       // res();
      }
    })
    .catch(error => {
      console.error('Error submitting OTP:', error);
     // res();
      // Handle the error case
    });
  
}

function handleUPIResponse(data) {
  const requestUrl = data.request.url
 let success = false
    typeWriter("Please approve the payment in psp app")
  setInterval(() => {
    fetch(requestUrl)
      .then(response => response.json())
      .then(data => {
        // Check the payment status
      
        if (stopTransaction ){
          throw new Error('Something went wrong.');
          return;
        } 

        if (success == true) {
          throw new Error('Something went wrong.');
          return;
        }

       
        const paymentStatus = data.status;
        console.log('Payment status:', paymentStatus);
        // Further processing or actions based on the payment status
        if (typeof paymentStatus !== "undefined") {
          typeWriter(". . . . . . . . . .")
        } else{
          data = "";
          displayPaymentSuccess(data, "upi")
          success = true
          return
        }
      })
      .catch(error => {
        console.log('Error:', error);
        // Handle the error case
        return
      });
  }, 5000); // Poll every 5 seconds
}

function displayPaymentSuccess(data, method) {
  const amount = document.getElementById('amount').value;
  readOutLoud("Payment SUccessful, redirecting to merchant site")

  setTimeout(() => {
  const successHTML = `
    <div class="success-message">
      <h3>Payment Successful!</h3>
      <p>Transaction ID: ${data.razorpay_payment_id}</p>
      <p>Amount:${amount} </p>
      <p>Payment Method: ${method}</p>
    </div>
  `;
  
  checkoutSection.innerHTML = successHTML;
  checkoutSection.style.display = 'block';
  overlay.style.display = 'none';
}, 2000);
}

// const hello = ["Hello human! What's up?",
//   "Hi, how are you doing?",
//   "What's up?",
//   "Ahoy matey! How are ye?",
//   "What's shaking?"
// ];

// const joke = ["How many programmers does it take to change a light bulb? None, it's a hardware problem...",
//   "Why do mummies have trouble keeping friends? Because they're so wrapped up in themselves.",
//   "What did one ocean say to the other ocean? Nothing, they just waved.",
//   "Two goldfish are in a tank. One turns to the other and says, 'Do you know how to drive this thing?'",
//   "Why did the pirate buy an eye patch? Because he couldn't afford an iPad!",
//   "What did the pirate say on his 80th birthday? Aye Matey!",
//   "Why don't scientists trust atoms? Because they make up everything."
// ];

// // Store voices
let voices = [];

// // UI elements
// const startBtn = document.getElementById("startBtn");
// const result = document.getElementById("result");
// const processing = document.getElementById("processing");

// Wait on voices to be loaded before fetching list
window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  console.log(voices)
};

if ('webkitSpeechRecognition' in window) {
  // Create a new instance of SpeechRecognition
  const recognition = new webkitSpeechRecognition();

  // Set the properties
  recognition.continuous = true; // Set to true for continuous recognition
  recognition.interimResults = true; // Set to true to get interim results

  // Start recognition
  recognition.start();

  // Handle the recognition result
  recognition.onresult = function(event) {

    const current = event.resultIndex;
    const recognitionResult = event.results[current];
    const recognitionText = recognitionResult[0].transcript;
    // const result = event.results[0][0].transcript;
    console.log('You said:', recognitionText);
    process(recognitionText)

    // recognition.start()
    // Do something with the recognized speech
  };

  // Handle recognition errors
  recognition.onerror = function(event) {
    console.error('Recognition error:', event.error);
  };

} else {
  console.error('Web Speech API is not supported in this browser.');
}

let UPIID = false
let paymentInitiated = false
function process(rawText) {
  let text = rawText.replace(/\s/g, "").replace(/\'/g, "");
  text = text.toLowerCase();
  let response = null;

  if (text.includes("stop") || text.includes("top")) {
    stopSpeech = true;
    stopTransaction = true
    //eadOutLoud("stopping the execution")
    return
   }

   if (stopSpeech) {
    stopSpeech = false
    stopTransaction = false
   }
    
   if (text.includes("initiate") || text.includes("make") || text.includes("card") || text.includes("payment") && (text.includes("axis") || text.includes("access"))) 
   {
    if (!paymentInitiated)
    {
      paymentInitiated = true
    
    let done = true;

    setTimeout(() => {
      if (done) {
        stopSpeech = false;
        stopTransaction = false
        speakNRead("Sure")()
        speakNRead("Initiating Axis Card Payment ending with 4 1 1 2", () => {
        done = false;
        cardPaymentData = generatePaymentData('card', '+919902529070', 'axis', '4444', 'INR', cardData);
        // console.log("123");
        makePaymentAPICall(cardPaymentData, 'card', 'https://api-web-varun-k.dev.razorpay.in/v1/payments/create/ajax?key_id=rzp_test_iFxtpfbj227eNO');
        })()
      }
    }, 1000);

    text = "done"
    return 
   }
   }


  return response;
}

// Set the text and voice attributes.
function readOutLoud(message, cb, onlyMessage=false) {
  return new Promise(res => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 5;
    speech.rate = 1;
    speech.pitch = 1.2;
    speech.voice = voices[144];
    window.speechSynthesis.speak(speech);
    if(stopSpeech) {
      window.speechSynthesis.cancel(speech)
    }
    speech.onend = () => {
      if(cb){
        cb()
      }
      res();
    }
  });
}

// // Function to process a message and generate a reply
// function processAndReply(message) {
//   const response = processMessage(message);
//   readOutLoud(response);
//   return response;
// }

// function displayOverlayText(text) {
//   const overlayTextElement = document.getElementById('overlay-text');
//   overlayTextElement.textContent = text;
// }

