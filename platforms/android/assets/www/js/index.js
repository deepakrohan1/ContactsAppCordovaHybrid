/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/*
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
*/

$(function(){
    
    $('#find').click(function(){
        navigator.notification.activityStart("Fetching contacts...", "loading");
            var options = new ContactFindOptions();
                options.filter="";
                options.multiple=true; 
                var fields = ["*"];
                navigator.contacts.find(fields, function(contacts){
                    console.log("@@contacts"+contacts);
                    if(contacts != null && contacts.length > 0){
                        $("#contact_ul").html("");
                        contacts = contacts.sort(function(a, b){
                              aName = a.displayName;
                              bName = b.displayName;
                              return aName < bName ? -1 : (aName == bName ? 0 : 1);
                        });
                        for(var i=0; i<contacts.length; i++){
                            var number = "NA";
                            if(contacts[i]==null || contacts[i].displayName== null){
                                continue;
                            }
                            
                            if(contacts[i].phoneNumbers != null && contacts[i].phoneNumbers.length > 0){
                                for(k=0; k<contacts[i].phoneNumbers.length; k++){
                                    if(contacts[i].phoneNumbers[k].type == "mobile"){
                                        number =    contacts[i].phoneNumbers[k].value;
                                        if(number == null || number == undefined){
                                            number = "NA";
                                        }
                                    }
                                }
                             
                            }
                            $("#contact_ul").append("<li><a href='index.html'>"+contacts[i].displayName +" "+  number+"</a></li>");
                        
                        }
                        $('#contact_ul').listview('refresh');
                        navigator.notification.activityStop();
                    }else{
                        navigator.notification.activityStop();
//                    alert("No Contacts Found");
                        navigator.notification.alert(
                            'No Contacts Found',  // message
                            function(){},         // callback
                            'ContactsApp',            // title
                            'OK'                  // buttonName
                        );
                    }
                }, function(){
                    navigator.notification.activityStop();
//                    alert("Error getting Contacts");
                    navigator.notification.alert(
                            'No Contacts Found',  // message
                            function(){},         // callback
                            'ContactsApp',            // title
                            'OK'                  // buttonName
                        );
                }, options);
    }
        );
    
});

    
function saveContact()
{
    var displayName = $('#displayName').val();
    var nickName = $('#nickName').val();
    var givenName = $('#givenName').val();
    var familyName = $('#familyName').val();
    var workTel = $('#workTel').val();
    var mobileTel = $('#mobileTel').val();
    var homeTel = $('#homeTel').val();
    console.log("@@saving : "+displayName);
    
    var myContact = navigator.contacts.create({"displayName": displayName});
    myContact.nickname = nickName;
    myContact.name = givenName + " " + familyName;
    
    var phoneNumbers = [];
phoneNumbers[0] = new ContactField('work', workTel, false);
phoneNumbers[1] = new ContactField('mobile', mobileTel, true); // preferred number
phoneNumbers[2] = new ContactField('home', homeTel, false);
myContact.phoneNumbers = phoneNumbers;
    
    myContact.save(function(){
//    alert("Contact saved successfully");
        navigator.notification.alert(
                            'Contact saved successfully',  // message
                            function(){},         // callback
                            'ContactsApp',            // title
                            'OK'                  // buttonName
                        );
    }, function(msg){
//    alert("Error saving contact: "+msg);
        navigator.notification.alert(
                            "Error saving contact: "+msg,  // message
                            function(){},         // callback
                            'ContactsApp',            // title
                            'OK'                  // buttonName
                        );
    });  //HERE
    console.log("The contact, " + myContact.displayName + ", note: " + myContact.note);
}
