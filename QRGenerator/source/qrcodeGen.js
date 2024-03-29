function checkFieldsNotEmpty() {
    var elements = [
        document.getElementById('surname'),
        document.getElementById('firsname'),
        document.getElementById('patronymic'),
        document.getElementById('gender'),
        document.getElementById('birthdate'),
        document.getElementById('age'),
        document.getElementById('phone'),
        document.getElementById('email'),
        document.getElementById('school'),
        document.getElementById('school_txt'),
        document.getElementById('address'),
        document.getElementById('classroom'),
        document.getElementById('subject'),
        document.getElementById('citizenship'),
        document.getElementById('code'),
        document.getElementById('series')
    ];

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].value === '') {
            return false; // Если одно из полей пустое, вернуть false
        }
    }

    return true; // Если все поля заполнены, вернуть true
}

function generateQR() {
    var surname = document.getElementById('surname');
    var firsname = document.getElementById('firsname');
    var patronymic = document.getElementById('patronymic');
    var gender = document.getElementById('gender');
    var birthdate = document.getElementById('birthdate');
    var age = document.getElementById('age');
    var phone = document.getElementById('phone');
    var email = document.getElementById('email');
    var school = document.getElementById('school');
    var schoolNum = document.getElementById('school_txt');
    var address = document.getElementById('address');
    var classroom = document.getElementById('classroom');
    var subject = document.getElementById('subject');
    var citizenship = document.getElementById('citizenship');
    var code = document.getElementById('code');
    var series = document.getElementById('series');

    var allFieldsFilled = checkFieldsNotEmpty();
    
    let imgBox = document.getElementById("imgBox")
    let qrImage = document.getElementById("qrImage")
    if (!allFieldsFilled) {
        // Одно или несколько полей пусты
        console.log('Пожалуйста, заполните все поля!');
    } else {
        // Все поля заполнены
        console.log('Все поля успешно заполнены!');
        var data = `${surname.value}; ${firsname.value}; ${patronymic.value}; ${gender.value}; ${birthdate.value}; ${age.value};${phone.value}; ${email.value}; ` +
        `${school.value} №${schoolNum.value}; ${address.value}; ${classroom.value}; ${subject.value}; ${citizenship.value}; ${series.value}; ${code.value}`;

        //TODO: "Вывод текста над QR Code'ом" 

        qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + data;
        imgBox.classList.add("show-img")

    }
}

