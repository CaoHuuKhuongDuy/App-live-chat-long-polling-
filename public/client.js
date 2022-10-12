let input = document.getElementById("chat");


input.addEventListener("keypress", (event) => {
    
    if (event.key === "Enter") 
        {
        event.preventDefault();
        document.getElementById("click_to_submit").click();
        }

});



function add_chat(chat_data)
{
    let node = document.createElement("li")
    let textnode = document.createTextNode(chat_data)
    node.append(textnode)
    document.getElementById("message").appendChild(node)
}


async function load_all_message()
{
    let chat_message = await fetch("/load")
    let chat_data = await chat_message.json()
    for (let i in chat_data.all_chat)
      add_chat(chat_data.all_chat[i])
}


async function subsciber()
{
    let chat_message = await fetch("/get_data")
    let chat_data = await chat_message.text()  
    add_chat(chat_data)
    subsciber()
}


function send_chat()
{
    let chat_message = document.getElementById("chat").value
    if (chat_message == "") return; 
    document.getElementById("chat").value = ""
    let url = "/send"
    let x = fetch(url, {
        method: "POST",
        body: chat_message
    })
}

load_all_message()

subsciber()

