const 
    searchItem = document.querySelectorAll('.search__item'),
    search = document.querySelector('.search__input');



search.addEventListener('input', (item) => {
    searchQuestion(search.value, searchItem)
})


document.addEventListener('DOMContentLoaded', (item) => {
    searchQuestion(search.value, searchItem)
})

function searchQuestion(searchString, searchItem)
{
    if(searchString != ' ')
    {   
        
        for(let i = 0; i < searchItem.length; i++)
        {   
            if( searchString != '' && searchString.length > 1)
            {
                let question = searchItem[i].children[0].innerText.trim().toUpperCase();
                if(question.includes(searchString.toUpperCase()))
                {   
                    if(searchItem[i].classList.contains('search__hide'))
                    {
                        searchItem[i].classList.remove('search__hide')
                    }
                    
                }
                else 
                {
                    if(!searchItem[i].classList.contains('search__hide'))
                    {
                        searchItem[i].classList.add('search__hide');
                    }
                }
            }
            else 
            {
                if(!searchItem[i].classList.contains('search__hide'))
                {
                    searchItem[i].classList.add('search__hide');
                } 
            }
            
        }
    }
}