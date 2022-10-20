/* 5 steps of AJAX */


/* 1. Initiate a XMLHttpRequest object */
const http = new XMLHttpRequest();

/* 2. Set an event listner to detect state change (listen to the response) */ //notify in 5 stages
http.addEventListener('readystatechange', ()=>{
    // console.log(http.readyState);
    if(http.readyState === http.DONE){  /* afetr the 5th step */
        if(http.status === 200){
            // console.log('Response received');
            // console.log(http.responseText);
            const members = JSON.parse(http.responseText);
            console.log(members);

            $('#loader').hide();
            if(members.length === 0){
                $('#tbl-members').addClass('empty');
            }

            members.forEach(member => {
                const rowHTML = `
                    <tr>
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
http.open('GET', 'https://3e3c04eb-b44a-4942-a1d1-314f0649ae4e.mock.pstmn.io/members', true); // asynchronous true to avoid blocking if not js engine will block

/* 4. Set additional information for the request */
// using provided document (headers, ...)

/* 5. Send the request */ // request eke body ekak or file ekak hv nam eka yawenneth methanadi
http.send();