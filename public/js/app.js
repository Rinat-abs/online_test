const questions = document.querySelectorAll('.test__pass__question');
const form = document.querySelector('.test__pass');
if(questions && form)
{

    form.addEventListener('submit', function (evt)  {
        let radio = document.querySelectorAll('input[type="radio"]:checked');
        evt.preventDefault();

        if(questions.length == radio.length)
        {
            
            evt.defaultPrevented;
            this.submit();
        }
        else 
        {
            alert('Ответьте на все вопросы');
        }

    });

}

if(document.querySelector('.progress')
 || document.querySelector('.result')  
 || document.querySelector('.test')
 || form
 )
{
    document.oncontextmenu = cmenu; function cmenu() { return false; } 
    
    document.onkeydown = function(e) {  
    if (e.keyCode == 123) {  
    return false;  
    }  
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {  
    return false;  
    }  
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {  
    return false;  
    }  
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {  
    return false;  
    }  
    
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {  
    return false;  
    }  
    } 
}