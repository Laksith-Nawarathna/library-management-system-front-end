/* 5 steps of AJAX */

const pageSize = 6;
let page = 2;

getMembers();

function getMembers(query=`${$('#txt-search').val()}`){
    
    /* 1. Initiate a XMLHttpRequest object */
    const http = new XMLHttpRequest();
    
    
    /* 2. Set an event listner to detect state change (listen to the response) */ //notify in 5 stages
    http.addEventListener('readystatechange', ()=>{
        // console.log(http.readyState);
        if(http.readyState === http.DONE){  /* afetr the 5th step */
            $("#loader").hide();
            if(http.status === 200){
                // console.log('Response received');
                // console.log(http.responseText);
    
                const totalMembers = +http.getResponseHeader('X-Total-Count');
                initPagination(totalMembers);
    
                const members = JSON.parse(http.responseText);
                console.log(members);
  
                if(members.length === 0){
                    $('#tbl-members').addClass('empty');
                }
    
                $('#tbl-members tbody tr').remove();
    
                members.forEach((member, index) => {
                    const rowHTML = `
                        <tr tabindex = "0">
                            <td>${member.id}</td>
                            <td>${member.name}</td>
                            <td>${member.address}</td>
                            <td>${member.contact}</td>
                        </tr>
                    `;
                    $('#tbl-members tbody').append(rowHTML);
                });
            }else{
                // console.error('Something went wrong');
                $('#toast').show();
            }
        }
    });
    
    /* 3. Open the request*/
    http.open('GET', `http://localhost:8080/lms/api/members?size=${pageSize}&page=${page}&q=${query}`, true); // asynchronous true to avoid blocking if not js engine will block
    
    /* 4. Set additional information for the request */
    // using provided document (headers, ...)
    
    /* 5. Send the request */ // request eke body ekak or file ekak hv nam eka yawenneth methanadi
    http.send();

}


function initPagination(totalMembers){
    const totalPages = Math.ceil(totalMembers/pageSize);

    if(totalPages <= 1){
        $("#pagination").addClass('d-none');
    }else{
        $("#pagination").removeClass('d-none');
    }

    let html = ``;

    for(let i = 1; i <= totalPages; i++){
        html += `<li class="page-item ${i===page? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`
    }

    html = `
    <li class="page-item ${page===1?'disabled':''}"><a class="page-link" href="#">Previous</a></li>
    ${html}
    <li class="page-item ${page===totalPages?'disabled':''}"><a class="page-link" href="#">Next</a></li>
    `;

    $('#pagination > .pagination').html(html);

}


$('#pagination > .pagination').click((eventData) => {
    const elm = eventData.target;
    if(elm && elm.tagName === 'A' ){
        const activePage = ($(elm).text());
        if(activePage === 'Next'){
            page++;
            getMembers();
        }else if(activePage === 'Previous'){
            page--;
            getMembers();
        }else{
            if(page !== activePage){
                page = +activePage;
                getMembers();
            }
        }
    }
});


$('#txt-search').on('input', () => {
    page = 1;
    getMembers();
});

$('#tbl-members tbody').keyup((eventData)=>{
    if (eventData.which === 38){
        const elm = document.activeElement.previousElementSibling;
        if (elm instanceof HTMLTableRowElement){
            elm.focus();
        }
    }else if (eventData.which === 40){
        const elm = document.activeElement.nextElementSibling;
        if (elm instanceof HTMLTableRowElement){
            elm.focus();
        }
    }
});


$(document).keydown((eventData) => {
    if(eventData.ctrlKey && eventData.key === '/'){
        $('#txt-search').focus();
    }
    // console.log(eventData);
});