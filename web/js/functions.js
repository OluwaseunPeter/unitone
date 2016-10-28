

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global data */
var cartArray = []; // holds cart item objects

/*TP: ondocument ready actions to be performed*/
 $( document ).ready(function() {
        $( "#pwBankdeposit").hide();
        $("#pwCard" ).hide();
        $("#pwCash").hide();
        $("#paymentCheckout").hide();
        $("#pwBankTransfer").hide();
        setTimeout(function(){
   agreementStatusChecked();
}, 450);
       
        calculateSum();
    });

/**
 * These functions are for the Order Page views/form
 */

function selectAgent(id)
{
    
   var row = $("#agentList tbody #row"+id);
   
   var id = $(row).find(".agentId").text();
   var fname = $(row).find(".agentFname").text();
   var mName = $(row).find(".agentMname").text();
   var lName = $(row).find(".agentLname").text();
   var phoneNo = $(row).find(".agentPhone").text();
   var email = $(row).find(".agentEmail").text();
   var state = $(row).find(".agentState").text();
   var photo = $(row).find(".agentImg").val();
   
   
   var fullname = lName + " " + fname + " " + mName;
   $("#agentDetailContainer .agent_name").text(fullname.trim());
   $("#agentDetailContainer .agent_moible").text(phoneNo);
   $("#agentDetailContainer .agent_state").text(state);
   
   $("#agentListContainer").toggle();
   $("#agentSpinnerContainer").toggle();
    setTimeout(function()
    {
        $("#agentSpinnerContainer").toggle();
        $("#agentDetailContainer").toggle();
    },1500);
    
    $("#agent_id").val(id);
}

function showAgentList()
{
    $("#agentDetailContainer").toggle();
    $("#agentSpinnerContainer").toggle();
    
    setTimeout(function()
    {
        $("#agentSpinnerContainer").toggle();
        $("#agentListContainer").toggle();
    },1500);
}

function showSelectedAgent()
{
    $("#agentListContainer").toggle();
   $("#agentSpinnerContainer").toggle();
    setTimeout(function()
    {
        $("#agentSpinnerContainer").toggle();
        $("#agentDetailContainer").toggle();
    },3000);
}

// Order Page View functions ends here

/**
 * 
 * These functions are for the customer page add new customer section
 */

    function showNextStep()
    {
        $("#step1").toggle();
        $("#step2").toggle();
        
        return false;
    }
    
    function showOrderProduct()
    {
        var proceed = validateCustomerRegForm();
        
        if(proceed == false)
        {
            return false;
        }
        
        $("#step1").css("display","none");
        $("#step2").css("display","block");
        
        $("#process-step-1").removeClass('btn-primary').addClass('btn-default');
        $("#process-step-2").removeClass('btn-default').addClass('btn-primary');
        $("#process-step-2").removeAttr('disabled');
        $("#process-step-3").removeClass('btn-primary').addClass('btn-default');
        
        return false;
    }
    
    function showCustomerReg()
    {
        $("#step1").css("display","block");
        $("#step2").css("display","none");
        
        $("#process-step-1").removeClass('btn-default').addClass('btn-primary');
        $("#process-step-2").removeClass('btn-primary').addClass('btn-default');
        $("#process-step-3").removeClass('btn-primary').addClass('btn-default');
        
        return false;
    }



/**
 * 
 * a generic method for sending an ajax delete request to the controller for entity name
 * @param {type} appName name of the application on server (NeoForce)
 * @param {type} entityName entity we are working on
 * @param {type} id ID of the entity record to delete
 * @returns None
 */

function deleteEntity(appName, entityName, id){
    url = appName + '/' + entityName;
    console.log("URL: " + url);
    
    $.ajax({
       type : 'GET',
       url : url,
       data : {id:id, action:'delete'},
       success: function(data){
           console.log("Delete Successful");
           $('#deleteModal').modal('hide');
           $('#row'+id + ',#row'+id + ' td').addClass("deleting");

           $('#row'+id).fadeOut(1500, function(){
               $('#row'+id).remove();
           });

       },
       error: function(){
           console.log("Delete NOT Successful");
       }
    });
}


/*TP: client side cidation of the required fields*/
function checkFormRequired(){
    
   var paymentMethod = $("#paymentMethod").val();
   
   //bank payment method;
   var bankName = $("#bankName").val();
   var depositorsName = $("#depositorsName").val();
   var tellerNumber = $("#tellerNumber").val();
   var tellerAmount = $("#tellerAmount").val();
   var message = "";
   
   //cash payment method
   var cashAmount = $("#cashAmount").val();
   if(paymentMethod==1){
      if(bankName==""){
          $("#bankName").focus();
          message += "Bank Name is required for the payment method selected\r\n";
      } 
      
      if(depositorsName==""){
          $("#depositorsName").focus();
          message += "Depositors Name is required for the payment method selected\r\n";
      }
      if(tellerNumber==""){
          $("#tellerNumber").focus();
          message += "Teller Number is required for the payment method selected\r\n";
      }
      if(tellerAmount==""){
          $("#tellerAmount").focus();
          message += "Teller Amount is required for the payment method selected\r\n";
      }
      
   }
   else if(paymentMethod==3){
       if(cashAmount==""){
       $("#cashAmount").focus();
       message += "Cash Amount is required for the payment method selected\r\n";
   }
   
   
   
   }
   if(message!=""){
       alert(message);
      return false; 
   }else{
       return true;
   }
}

/*TP: validation to make sure the lodgement the user wants to make is valid*/
function lodgePaymentCheck(){
    var defAmount = parseInt($("#defAmount").val());
    var amountLeft = parseInt($("#amountLeft").val());
    var durationLeft = parseInt($("#durationLeft").val());
    var productAmountToPay = parseInt($("#productAmountToPay").val());
    $("#tellerAmount").val(productAmountToPay);
    $("#cashAmount").val(productAmountToPay);
//    if(productAmountToPay > amountLeft){
//            alert("Product amount is greater than the amount left");
//        }else{
//           alert("Product amount is less  than the amount left");
//        }
        
    if(productAmountToPay>defAmount && amountLeft==productAmountToPay){
        //this is the part of the last payment of the user
        
        $("#payLodge").attr("disabled",false);
        return true;
        
    }
    else if(productAmountToPay<=defAmount && amountLeft==productAmountToPay){
        //this is the system's last payment 
       // alert("yes yea system last payment");
        $("#errorText").text("");
        $("#payLodge").attr("disabled",false);
        return true;
        
    }
    else if((productAmountToPay>defAmount) && (productAmountToPay <= amountLeft)){
//        alert("This is the product amount "+productAmountToPay);
//        alert("This is the amount left amount "+amountLeft);
        
        //this is the part where the multiples of the amount user is paying is needed
        if((productAmountToPay%defAmount) >0){
           // alert("You need to input an amount that is a multiple of the preset monthly payment");
            $("#productAmountToPay").focus();
            $("#payLodge").attr("disabled",true);
            if($("#multPayment").length <= 0){
             $("#errorText").append("<p id='multPayment'>You need to input an amount that is a multiple of the preset monthly payment, or you stick to the default muonthly payment plan </p>");
         }
         return false;
        }else{
            alert("proper multiple payment");
            $("#errorText").text("");
            $("#payLodge").attr("disabled",false);
            return true;
        }
        
    }else if(productAmountToPay==defAmount){
        //this is the normal payment
       // alert("this is the payment thing");
        $("#errorText").text("");
        $("#payLodge").attr("disabled",false);
        return true;
    }
    else if(productAmountToPay<defAmount){
       // alert("The amount cant be lss than the normal point");
        $("#payLodge").attr("disabled",true);
         if($("#minAmount").length <= 0){
        $("#errorText").append("<p id='minAmount'>The amount you can pay cannot be less than the preset monthly payment</p>");
    }
    return false;
    }else{
         $("#payLodge").attr("disabled",true);
          if($("#maxAmount").length <= 0){
        $("#errorText").append("<p id='maxAmount'>The amount you want to pay has exceeded the amount you have left</p>");
    }
    return false;
    }
    
}

/*TP: calculate the sum of the total amount of items in the cart*/
function calculateSum(){
    var sum = 0;
// iterate through each td based on class and add the values
$(".payOut").each(function() {

    var value = $(this).text();
    // add only if the value is number
    if(!isNaN(value) && value.length != 0) {
        sum += parseFloat(value);
    }
});
    if(sum==0){
       $("#checkOutToPay").attr("disabled",true);
    }else{
       $("#checkOutToPay").attr("disabled",false);
    }
    $("#cartSum").text(sum);
    
}

/*TP: add item to the cart*/
function addToCart(event){
   $("#shoppingCart:hidden").toggle();
   $("#paymentCheckout:visible").toggle();
  var productName = $("#selectProduct :selected").text();
  var productId = $("#selectProduct").val();
  var productUnitName = $("#selectUnit :selected").text();
  var productUnitId = $("#selectUnit").val();
  var productQuantity = $("#selectQuantity").val(); //Product Quantity (Quantity)
  var productAmount = $("#productAmount").val(); //Cost Per Unit * Qty
  var amountUnit = $("#amountUnit").text(); // Cost Per Unit {Inside Span}
  var amountTotalUnit = $("#amountTotalUnit").text(); //Cost Per Unit  * Qty {Inside Span}
  var initialAmountPerUnit = $("#initialAmountPerUnit").text(); // least deposit Per Unit
  var minInitialAmountSpan = $("#minInitialAmountSpan").text(); // Least deposit per Unit * Qty
  var productMinimumInitialAmount = $("#productMinimumInitialAmount").val(); // First deposited amount(Initial_Deposit)
  var amountLeft = $("#amountLeft").val(); // Amount to be completed/Serviced
  var payDurationPerUnit = $("#payDurationPerUnit").text(); // Pay Duration Per Unit
  var payDurationPerQuantity = $("#payDurationPerQuantity").text(); // Pay Duration Per Unit * Qty
  var productMaximumDuration = $("#productMaximumDuration").val(); //Product Max Pay Duration
  var monthlyPayPerUnit = $("#monthlyPayPerUnit").text();
  var monthlyPayPerQuantity = $("#monthlyPayPerQuantity").text();
  var productMinimumMonthlyPayment = $("#productMinimumMonthlyPayment").val(); // Monthly Pay Per Unit
  
  //alert(productName+" "+productId+" "+productUnitName+" "+productUnitId+" "+productQuantity);
  
//  var dataArray = [];
//  dataArray.push(productName,productId,productUnitName,productUnitId,productQuantity,productAmount,amountUnit,amountTotalUnit,
//  initialAmountPerUnit,minInitialAmountSpan,productMinimumInitialAmount,amountLeft,payDurationPerUnit,payDurationPerQuantity,productMaximumDuration,monthlyPayPerUnit,monthlyPayPerQuantity,productMinimumMonthlyPayment);
//  
  
  var dataArray = {productName:productName, productId: productId,productUnitName:productUnitName,productUnitId:productUnitId,productQuanity:productQuantity,productAmount:productAmount,amountUnit:amountUnit,amountTotalUnit:amountTotalUnit,
  initialAmountPerUnit:initialAmountPerUnit,minInitialAmountSpan:minInitialAmountSpan,productMinimumInitialAmount:productMinimumInitialAmount,amountLeft:amountLeft,payDurationPerUnit:payDurationPerUnit,payDurationPerQuantity:payDurationPerQuantity,
  productMaximumDuration:productMaximumDuration,monthlyPayPerUnit:monthlyPayPerUnit,monthlyPayPerQuantity:monthlyPayPerQuantity,productMinimumMonthlyPayment:productMinimumMonthlyPayment}
  
  /**
   * 
   * Push Cart item Object into cart array,
   * Stringify cart item Object and insert into cart table column with  id {tr<id>}
   * where <id> is the position of the cart row in the table.
   */
  
  var cartItemObject = dataArray;
  var jsonData = JSON.stringify(dataArray);
  
  var id = $('#productCart tr:last').attr('id'); // Get the id of the last row in the cart table
  
  if(id == null){
      id = 0;
  }
  if(id < 1 || isNaN(id)){
      id = 0;
  }
  
  /**
   * Check if the user clicked the cart item edit button,
   * so as to replace the edited item, with the item presently
   * in the cart.
   */ 
  
  if($("#editMode").val()=="" || $("#editMode").val()== null){
          var newId = parseInt(id) + 1;
      }else{
          var newId = $("#editMode").val();
      }
 // alert(id);
 
  //alert(newId);
  var buttonsData = '<a class="btn btn-success btn-xs" href="#" role="button" onclick="return editDataFromCart('+newId+')" title="Edit product details"><i class="fa fa-pencil"></i></a>\n\
<a class="btn btn-danger btn-xs" href="#" title="Remove product from cart"  onclick="return showDeleteCartModal('+newId+')" role="button"><i class="fa fa-remove"></i></a>';

  //var newId = id + 1;
  var dataTr = "<tr id='"+newId+"' align='left'>";
      dataTr += "<td>"+productName+"</td>";
      dataTr += "<td>"+productUnitName+"</td>";
      dataTr += "<td>"+productQuantity+"</td>";
      dataTr += "<td>"+productAmount+"</td>";
      dataTr += "<td>"+productMinimumInitialAmount+"</td>";
      dataTr += "<td>"+amountLeft+"</td>";
      dataTr += "<td>"+productMaximumDuration+"</td>";
      dataTr += "<td>"+productMinimumMonthlyPayment+"</td>";
      dataTr += "<td class='payOut'>"+productMinimumInitialAmount+"</td>";
      
      var rowId ="tr"+newId;
      
      dataTr +="<td class='cart-td'><input type='hidden' id='"+rowId+"' value='"+jsonData+"'/>"+buttonsData+"</td>";
      //alert($("#editMode").val());
    //$("#" + id).html();
      $("#productCart tbody").focus();
      
      if($("#editMode").val() == "")
      {  
          $("#productCart tbody").append(dataTr);
          cartArray.push(cartItemObject);
      }
      else
      {
          $("tr#"+newId).replaceWith(dataTr);
          /**
           * Get the position of the row in table and minus 1 to get
           * the position of the cart object in the cartArray Object
          **/
          cartArray[newId - 1] = cartItemObject;
      }
      
      
      $('#'+newId + ',#'+newId + ' td').addClass("adding",1000,"easeInOutBack");
      $('#'+newId).fadeIn(23500,function(){
          $('#'+newId + ',#'+newId + ' td').removeClass("adding"); 
      });
      
     calculateSum();
      
      $("#editMode").val("");
     resetForm();
    // $("#editMode").val("");
     $("#selectProduct").val("");
     $("#productCart tbody").focus();
     $("#addToCart").text("");
     $("#addToCart").append("<i class='fa fa-cart-plus'></i> Add to Cart");
     
     return false;
}


/*TP: show the payment details menu based on the payment method selected*/
function showNecessaryMenu(pmtMethod){
    
    if(pmtMethod==1){
        $("#pwCard:visible" ).toggle();
        $("#pwCash:visible").toggle();
        $("#pwBankTransfer:visible").toggle();
         $( "#pwBankdeposit:hidden").toggle();
          
    }else if(pmtMethod==2){
       $("#pwCash:visible").toggle();
       $( "#pwBankdeposit:visible").toggle();
       $("#pwBankTransfer:visible").toggle();
       $("#pwCard:hidden" ).toggle();
        //alert("You have selected pay online");
    }
    else if(pmtMethod==3){
        $( "#pwBankdeposit:visible").toggle();
        $("#pwCard:visible" ).toggle();
        $("#pwBankTransfer:visible").toggle();
        $("#pwCash:hidden").toggle();
    }
    else if(pmtMethod==4){
        $( "#pwBankdeposit:visible").toggle();
        $("#pwCard:visible" ).toggle();
        $("#pwCash:visible").toggle();
        $("#pwBankTransfer:hidden").toggle();
    }
}

/*TP: pass data back to the form to edit*/
function editDataFromCart(id){
    
    //alert("hhello");
    var datajson = $("#tr"+id).val();
    $("#editMode").val(id);
    //alert(datajson);
    var dataArray = JSON.parse(datajson);
    
    var productName =  dataArray.productName;
  var productId = dataArray.productId;
  var productUnitName = dataArray.productUnitName;
  var productUnitId = dataArray.productUnitId;
  var productQuantity = dataArray.productQuanity;
  var productAmount = dataArray.productAmount;
  var amountUnit = dataArray.amountUnit;
  var amountTotalUnit = dataArray.amountTotalUnit;
  var initialAmountPerUnit = dataArray.initialAmountPerUnit;
  var minInitialAmountSpan = dataArray.minInitialAmountSpan;
  var productMinimumInitialAmount = dataArray.productMinimumInitialAmount;
  //alert(productMinimumInitialAmount);
  var amountLeft = dataArray.amountLeft;
  var payDurationPerUnit = dataArray.payDurationPerUnit;
  var payDurationPerQuantity = dataArray.payDurationPerQuantity;
  var productMaximumDuration = dataArray.productMaximumDuration;
  var monthlyPayPerUnit = dataArray.monthlyPayPerUnit;
  var monthlyPayPerQuantity = dataArray.monthlyPayPerQuantity;
  var productMinimumMonthlyPayment = dataArray.productMinimumMonthlyPayment;
 // alert(dataArray[14]);
    
    var baseUrl = getBaseUrl().toString();
    //alert(productQuantity);
    //baseUrl.substring()
    baseUrl = baseUrl.substr(0, (baseUrl.length)-1)
//    alert(subString);
//alert(productUnitId);
    $("#addToCart").text("");
    $("#addToCart").append("<i class='fa fa-cart-plus'></i> Update Cart Item");
//    $("#addToCart").text("<i class='fa fa-cart-plus'></i> Update Cart Item");
    $("#selectProduct").val(productId);
    $("#selectUnit").val(productUnitId);
    $("#pUnitId").val(productUnitId);
    $("#productQuantity").val(productQuantity);
    $("#productAmount").val(productAmount);
    $("#amountUnit").text(amountUnit);
    $("#amountTotalUnit").text(amountTotalUnit);
    $("#initialAmountPerUnit").text(initialAmountPerUnit);
    $("#minInitialAmountSpan").text(minInitialAmountSpan);
    $("#productMinimumInitialAmount").val(productMinimumInitialAmount);
    $("#amountLeft").val(amountLeft);
    $("#payDurationPerUnit").text(payDurationPerUnit);
    $("#payDurationPerQuantity").text(payDurationPerQuantity);
    $("#productMaximumDuration").val(productMaximumDuration);
    $("#monthlyPayPerUnit").text(monthlyPayPerUnit);
    $("#monthlyPayPerQuantity").text(monthlyPayPerQuantity);
    $("#productMinimumMonthlyPayment").val(productMinimumMonthlyPayment);
    $("#addToCart").val("Update Cart");
    document.getElementById("selectUnit").value = productUnitId;
    $("#pUnitId").val(productUnitId);
    
    getProjectUnits(baseUrl, 'Project');
    
    
    //alert(productUnitId);
//    $("#selectUnit").val(productUnitId);
//    $("#selectUnit").val(productUnitId);
//    alert(productUnitId);
    getProjectQuantity(baseUrl, 'ProjectUnit');
    
    
    $("#productQuantity").val(productQuantity);
    $("#productMaximumDuration").val(productMaximumDuration);
    
    
    
    

setTimeout(function(){
    updateUnit(id)
}, 450);

  return false;
}

/*TP: */
function updateUnit(id){
    
     var datajson = $("#tr"+id).val();
    //alert(datajson);
    var dataArray = JSON.parse(datajson);
    var productUnitId = dataArray.productUnitId;
    var productQuantity = dataArray.productQuanity;
    var productMinimumInitialAmount = dataArray.productMinimumInitialAmount;
    var productAmount = dataArray.productAmount;
    var productMaximumDuration = dataArray.productMaximumDuration;
    //alert(productMinimumInitialAmount);
    
//    var productUnitId = $("#pUnitId").val();
   //alert(productUnitId);
   
    $('#selectUnit').val(productUnitId);
//getProjectQuantity(baseUrl, 'ProjectUnit');
    $("#selectQuantity").val(productQuantity);
    $("#productAmount").val(productAmount);
    $("#productMaximumDuration").val(productMaximumDuration);
//$("#monthlyPayPerUnit").text(monthlyPayPerUnit);
    $("#productMinimumInitialAmount").val(productMinimumInitialAmount);
    monthlyPayCalculator();
//alert(productQuantity);
}

/*TP: get the base url to be used later by other methods*/
function getBaseUrl() {
    var re = new RegExp(/^.*\//);
    
    
    return re.exec(window.location.href);
}


/*TP: delete item from cart*/
function deleteDataFromCart(id){
    
    $("#productCart tbody").focus();
    
       console.log("Delete Successful");
       $('#deleteModalCart').modal('hide');
       $('#'+id + ',#'+id + ' td').addClass("deleting");
       $('#'+id).fadeOut(1000); 
       $("tr#"+id).remove();
       cartArray.splice(id -1, 1);
       calculateSum();
    
    $("#productCart tbody").focus();
    return false;
}

/*TP: make payment for a given lodgment*/
function payLodge(){
    var productAmountToPay = parseInt($("#productAmountToPay").val());
    if(lodgePaymentCheck()){
         var sum  = $("#paySum").text(productAmountToPay);
         var dataArray = {};
         dataArray["invoiceId"] = $("#invoiceId");
         dataArray["amountPaying"] = $("#amountPaying");
         
         $("#paymentCheckout:hidden").toggle();
         $("#shoppingCart:visible").toggle();
    }
    return false;
}

/*TP: CHeck of the cart*/
function checkOutOfCart(){
    //allData
    
        
         calculateSum();
    var sum  = $("#cartSum").text();
    $("#paySum").text(sum);
    if(sum==0 || sum==null){
        return false;
    }
    $('#productCart > tbody').focus();
    var cartDataArray = {};
     var data = new Array();
       var dataArray  = "";
       var id = "";
       var dataCenter = [];
       var i = 0;
    $('#productCart > tbody  > tr').each(function() {
          id = $(this).attr("id");
         dataArray = $("#tr"+id).val();
         //dataCenter.push(dataArray);
         
    });
    
    cartDataArray.sales = cartArray;
    console.log(JSON.stringify(cartDataArray));
    
    var cartDataArrays = JSON.stringify(cartDataArray);
    
//    cartDataArrays = cartDataArrays.replace('"{','{');
//    cartDataArrays = cartDataArrays.replace('}"','}');
//    cartDataArrays = cartDataArrays.replace('"sales"','sales');
    $("#cartDataJson").val(cartDataArrays);
    alert(cartDataArrays);
    $("#paymentCheckout:hidden").toggle();
    //$("#shoppingCart:visible").toggle();
    
    
    $("#process-step-1").removeClass('btn-primary').addClass('btn-default');
    $("#process-step-2").removeClass('btn-primary').addClass('btn-default');
    $("#process-step-3").removeClass('btn-default').removeAttr('disabled').addClass('btn-primary');
    
   
    return false;
}

/*TP: Reset the product order form*/
function resetForm(){
    
   $('#selectQuantity').empty(); //select
   
$('#productMinimumInitialAmount').val("");
$("#productMinimumMonthlyPayment").val("");
$('#productMaximumDuration').empty(); //select
$('#productAmount').val("");
$("#monthlyPayPerUnit").text("");
$("#payDurationPerUnit").text("");
$("#minInitialAmountSpan").text("");
$("#initialAmountPerUnit").text("");
$("#amountTotalUnit").text("");
$("#amountUnit").text("");
 $('span[id="qty"]').text("");
$("#finalAmount").text("");
$("#amountLeft").val("");
$("#addToCart").attr("disabled",false);
$('#selectUnit').empty(); //select 
    
      $('#selectUnit').append($('<option>', {
    value: "",
    text: "-- choose --"
}));

$('#productMaximumDuration').append($('<option>', {
    value: "",
    text: "-- choose --"
}));

$('#selectQuantity').append($('<option>', {
    value: "",
    text: "-- choose --"
}));

}

function cancelSelection(appName,entityName,agentId){
    var locator = "#row"+agentId+" #switch-state";
     setTimeout(function(){
   var type;
    url = appName + '/' + entityName;
    console.log("URL: " + url);
    $(locator).iCheck('uncheck');
     },
    450);
    
    //setTimeout(function(){ $(locator).iCheck('uncheck');}, 1);
}
/*TP: Activate the new agent via the switch and transfer to agent list*/
function checkActivateSwitchWait(appName,entityName,agentId){
    //alert("heello world");
    setTimeout(function(){
   var type;
    url = appName + '/' + entityName;
    console.log("URL: " + url);
     var locator = "#row"+agentId+" #switch-state";
      var result = $(locator).parent('[class*="icheckbox"]').hasClass("checked");
      //alert(result);
      
//      var value = $("#row"+agentId+" #switch-state").val();
//      alert(value+"this is the spirit of prophecy"+result+" locator"+locator);
//      alert($(locator).prop('checked'));
      var status;
      if(result == true){
          status = 1;
      }else{
          status = 0;
          $(locator).on('ifChecked', function() {
    $(locator).iCheck('uncheck');
});
          
      }
      console.log("URL: " + url);
    
     if(result==true){
         activateAgent(appName,entityName,agentId,status)
//         $.ajax({
//       type : 'POST',
//       url : url,
//       data : {updateStatusWait:status,agent_id:agentId},
//       success: function(response){
//          // alert("this is successful");
//           console.log("Successful: " + JSON.stringify(response));
//           var resp = JSON.parse(response);
////           alert("working");
//           removeTableElement(agentId);
//           //alert(response);
//            $('#activateModal').modal('hide');
//       },
//       error: function(xHr, status, error){
//           console.log("NOT Successful: " + xHr.responseText);
//           //processSubmitError(xHr.responseText);
//       }
//    });
     }
    
    
    
}, 450);
}

function activateAgent(appName,entityName,agentId,status){
    url = appName + '/' + entityName;
    $.ajax({
       type : 'POST',
       url : url,
       data : {updateStatusWait:status,agent_id:agentId},
       success: function(response){
          // alert("this is successful");
           console.log("Successful: " + JSON.stringify(response));
           var resp = JSON.parse(response);
//           alert("working");
           removeTableElement(agentId); 
           
           $('#activateModal').modal('hide');
           
           handleAfterHideBehaviour(appName, entityName);
           
       },
       error: function(xHr, status, error){
           console.log("NOT Successful: " + xHr.responseText);
           $('#activateModal .modal-body').html('An error occurred trying to activate agent');
           //processSubmitError(xHr.responseText);
       }
    });
}

/**
 * This method detects what action to take after hiding agent activation modal
 * @param {type} appName the application context - /NeoForce
 * @returns none
 */
function handleAfterHideBehaviour(context, entityName){
        if($("#removeMessage").length > 0){
            var message = '<br/><div class="row"><div class="col-md-12 "><p class="bg-success padding15" style="vertical-align:center !important;" ><i class="fa fa-check"></i>Agent successfully activated and moved to approved agents list. [<a href="Agent"><i>see approved agents list</i></a>] </p></div></div>';        
            $("#removeMessage").html(message);
        }
        if($("#approve-agent-btn").length > 0){
           window.location = context + "/" + entityName + "?action=waiting";
        }
}


function removeTableElement(agent_id){
    
    
    $('#row'+agent_id).fadeOut(1500, function(){
               $('#row'+agent_id).remove();
           });
}

/*TP: Activate the agent via the switch created*/
function checkActivateSwitch(appName,entityName,agentId){
      
    
setTimeout(function(){
   var type;
    url = appName + '/' + entityName;
    console.log("URL: " + url);
     var locator = "#row"+agentId+" #switch-state";
      var result = $("#row"+agentId+" #switch-state").prop('checked');
//      var value = $("#row"+agentId+" #switch-state").val();
//      alert(value+"this is the spirit of prophecy"+result+" locator"+locator);
//      alert($(locator).prop('checked'));
      var status;
      if(result == true){
          status = 1;
      }else{
          status = 0;
      }
      console.log("URL: " + url);
    
  
    
    $.ajax({
       type : 'POST',
       url : url,
       data : {updateStatus:status,agent_id:agentId},
       success: function(response){
           console.log("Successful: " + JSON.stringify(response));
//           var resp = JSON.parse(response);
//           alert(response);
       $("#row"+agentId+" #switch-state").click();
       },
       error: function(xHr, status, error){
           console.log("NOT Successful: " + xHr.responseText);
           //processSubmitError(xHr.responseText);
       }
    });
    
}, 450);
   
}

/*TP: Get the project units*/
function getProjectUnits(appName, entityName){
   // alert(punit);
   //url = appName + '/' + entityName;
    $("#addToCart").attr("disabled",false);
    var id =  $('#selectProduct').val();
     url = appName + '/' + entityName;
    console.log("URL: " + url);
resetForm();
    $.ajax({
       type : 'GET',
       url : url,
       data : {project_id:id, action:'punits'},
       success: function(data){
           
           alert(data);
           var resp = JSON.parse(data);
           $('#selectUnit').empty();
           $('#selectUnit').append($('<option>', {value: "",text: "-- choose --"}));

           $.each( resp, function( key, value ) {
          // $('#selectUnit').empty();
          //alert(value);

           $('#selectUnit').append($('<option>', {
            value: value.id,
            text: value.title,


        }));

        });

           console.log("Loading project Units Successful");

       },
       error: function(){
           console.log("Loading Project Units NOT Successful");
       }
    });
    
}

/*TP: Get the project quantity*/
function getProjectQuantity(appName, entityName){
    $("#addToCart").attr("disabled",false);
    var id =  $('#selectUnit').val();
    if(id== null || id==""){
        id = $("#pUnitId").val();
    }
    
    
     url = appName + '/' + entityName;
    console.log("URL: " + url);
//    alert(id);
//    alert(url);
    $.ajax({
       type : 'GET',
       url : url,
       data : {id:id, action:'edit'},
       success: function(data){
           
           //alert(data);
           var resp = JSON.parse(data);
          
           
           $("#dataHidden").val(data);
           $('#selectQuantity').empty();
           
        
          
          for(var i=1;i<=resp.quantity;i++){
              // $('#selectUnit').empty();
               $('#selectQuantity').append($('<option>', {
    value: i,
    text: i
}));
          }
          calculateProductAmount();
          //monthlyPayCalculator();
       
               //alert(value.id+"--> "+value.title);


           console.log("Loading project Quantities Successful");
//           $('#deleteModal').modal('hide');
//           $('#row'+id + ',#row'+id + ' td').addClass("deleting");
//           $('#row'+id).fadeOut(1500);
       },
       error: function(){
           console.log("Loading Project Quantities NOT Successful");
       }
    });
    
}

/*TP: calculate the monthly pay*/
function monthlyPayCalculator(){
    $("#addToCart").attr("disabled",false);
    var productAmount = $("#productAmount").val();
    //alert(productAmount);
    var quantity = $("#selectQuantity").val();
    var productMinimumInitialAmount = $("#productMinimumInitialAmount").val();
    //alert(productMinimumInitialAmount);
    var productMaximumDuration = $("#productMaximumDuration").val();
    //alert(productMaximumDuration);
    var payLeft = productAmount - productMinimumInitialAmount;
    $("#amountLeft").val(payLeft);
    var monthlyPay = payLeft / productMaximumDuration;
    $("#productMinimumMonthlyPayment").val(monthlyPay);
    $("#monthlyPayPerUnit").text(monthlyPay * 1);
    $("#monthlyPayPerQuantity").text(monthlyPay * quantity);
    calculateAmountToPay();
}

/*TP: calculate the amount to pay*/
function calculateAmountToPay(){
   // alert("we are working here");
   
    $("#addToCart").attr("disabled",false);
    var userInitialAmount = $("#productMinimumInitialAmount").val();
     var data = $("#dataHidden").val();
    //alert(data);
    var resp = JSON.parse(data);
    var quantity = $("#selectQuantity").val();
//    alert(quantity);
//    alert(userInitialAmount);
    var lid = resp.lid;  
    var leastInitialDeposit = lid * quantity;
    //alert(leastInitialDeposit);
    
    var productAmount = $("#productAmount").val();
    if(userInitialAmount<leastInitialDeposit){
        //alert("The Initial Deposit must not be less than the default minimum initial amount specified by the system i.e ( N"+leastInitialDeposit+")");
        //jQuery.data( $("#errorText"), "errorDInitDep", "The Initial Deposit must not be less than the default minimum initial amount specified by the system i.e ( N"+leastInitialDeposit+")" );
        if($("#errorInitDep").length <= 0){
        var htmlMessage = $('<p id="errorInitDep">The Initial Deposit must not be less than the default minimum initial amount specified by the system i.e ( N'+leastInitialDeposit+')</p>')
        $("#errorText").append(htmlMessage);
    }
        //$("#errorText").text("<p id='errorInitDep'>The Initial Deposit must not be less than the default minimum initial amount specified by the system i.e ( N"+leastInitialDeposit+")</p>");
    
            $("#addToCart").attr("disabled",true);
        $("#productMinimumInitialAmount").focus();
    }else{
        $("#errorInitDep").remove();
        $("#errorText").text("");
        $("#amountLeft").val(productAmount - userInitialAmount);
        calculateDurationFromMonthlyPay();
    }
    
    
}

/*TP: calculate the duration from monthly pay*/
function calculateDurationFromMonthlyPay(){
    var data = $("#dataHidden").val();
    $("#addToCart").attr("disabled",false);
    var resp = JSON.parse(data);
    var duration = resp.mpd;
    
    
    var quantity = $("#selectQuantity").val();
    
    var quantityDuration = duration ;
    $("#finalAmount").text("");
    var productMinimumMonthlyPayment = $("#productMinimumMonthlyPayment").val();
    var amountLeft = $("#amountLeft").val();
    var monthLeft = Math.ceil(amountLeft / productMinimumMonthlyPayment);
    
    var finalAmount = amountLeft % productMinimumMonthlyPayment ;
  //  alert("hello this is where we work month-->"+monthLeft+" finalAmount "+ quantityDuration);
    
    if(monthLeft>quantityDuration){
       // alert("The duration has exceeded the maximum duration considering the monthly pay inputed ");
//       $("#errorText").append()
   //    jQuery.append( $("#errorText"), "errorDuration", "The duration has exceeded the maximum duration considering the monthly pay inputed" );
   if($("#errorDuration").length <= 0){
        var htmlMessage = $('<p id="errorDuration">The duration has exceeded the maximum duration considering the monthly pay inputed </p>');
        $("#errorText").append(htmlMessage);
    }
            $("#addToCart").attr("disabled",true);
        $("#productMinimumMonthlyPayment").focus();
       //alert($("#addToCart").val());
        
    }else{
        //$("#errorText").a
        $("#errorDuration").remove();
        $("#productMaximumDuration").val(monthLeft);
        if(finalAmount>0){
        $("#finalAmount").text("Final Month Amount: N "+finalAmount);
        }
    }
   
}

/*TP: calculate the product amount from the quantity*/
function calculateProductAmount(){
    var data = $("#dataHidden").val();
    //alert(data);
    var resp = JSON.parse(data);
    
    var cpu = resp.cpu;
    //alert(cpu);
    var quantity = $("#selectQuantity").val();
    var duration = resp.mpd;
    //$( quantity ).prependTo( "#qty" );
    //alert("The quantity is "+quantity);
    $('span[id="qty"]').text( quantity);
    var discount = resp.discount;
    var totalDiscount = 0;
    if(discount>0){
        totalDiscount = discount * quantity;
    }
    //var totalDiscount = discount * quantity;
    //alert(quantity);
    var amount = quantity * cpu;
    var mpd = resp.mpd;
    var defaultDiscount = 0;
   
    
  defaultDiscount = (cpu * 1)- ((discount/100)*cpu);
    
    var totalDiscountAmount = 0;
    if(totalDiscount>0){
      totalDiscountAmount = amount * (totalDiscount/100);
    }
    var totalDuration  = duration ;
    var durationPerUnit = resp.mpd;

    var finalAmount = amount - totalDiscountAmount;
    $("#amountUnit").text(defaultDiscount);
    $("#amountTotalUnit").text(finalAmount)
    $("#productAmount").val(finalAmount);
    $("#initialAmountPerUnit").text(resp.lid *1);
    $("#minInitialAmountSpan").text(resp.lid * quantity);
    var durationPerUnit = durationPerUnit * 1;
    var alertMessage = "month";
    if(durationPerUnit>1){
        alertMessage = "months";
    }
    $("#payDurationPerUnit").text(durationPerUnit+" "+alertMessage);
     var durationPerQuantity = durationPerUnit * quantity;
    
    //var alertMessage = "month";
    if(durationPerQuantity>1){
        alertMessage = "months";
    }
    
    $("#payDurationPerQuantity").text(durationPerQuantity+" "+alertMessage);
    
    $("#productMinimumInitialAmount").val( resp.lid * quantity);
  
    
    
    //alert(totalDuration);
     var message = "month";
     
       $('#productMaximumDuration').empty();
           
           $('#productMaximumDuration').append($('<option>', {
    value: "",
    text: "-- choose --"
}));
          
          var message = "month";
          for(var i=1;i<=totalDuration;i++){
              // $('#selectUnit').empty();
              if(i>1){
                  message = "months";
              }
              
               $('#productMaximumDuration').append($('<option>', {
    value: i,
    text: i+" "+message,
    selected: true
}));
$(this).attr("selected","selected");

          }
          
   
    
    monthlyPayCalculator();
    
}

/*TP: Modal for the agreement status of the agent*/
function modal_agree(){
    $("#agree").attr("checked",true);
    $('input[id="agentCreate"]').attr( "disabled",false);
    $('#agreementStatusModal').modal('hide');
    $("#agree").attr("checked",true);
    
}

/*TP: check the agreement status*/
function agreementStatusChecked(element){
    //alert(status);
    var button = $(element).val();
   
//    $("#agentForm input[name=agreement_document]").val();
//    alert("This is the agent id "+$("#agent_id").val());
//     alert("This is the agent id "+$("#id").val());
   if(element==null){
       if(($("#agent_id").val())!="" && ($("#agent_id").val())!=null){
//           alert("in the false place");
//           alert($("#agent_id").val());
      $('input[id="agentCreate"]').attr( "disabled",false);
  }else{
//      alert($("#agent_id").val());
//      alert("This is the operable thingy");
      $('input[id="agentCreate"]').attr( "disabled",true);
  }
    }
    else if(button=="agree"){
        $('input[id="agentCreate"]').attr( "disabled",false);
    }
    else{
        $('input[id="agentCreate"]').attr( "disabled",true);
    }
   
}

/*TP: show the delete modal for each entity*/
function showDeleteModal(context, entityName, id){    
    var args = "deleteEntity('" + context + "'," + "'" + entityName + "'," + "'" + id + "')";
    $("#deleteModal #ok").attr("onclick", args);
    $('#deleteModal').modal();
}

function showActivateModal(context, entityName, id, status){
   // alert("hello");
  //var args = "checkActivateSwitchWait('" + context + "'," + "'" + entityName + "'," + "'" + id + "')";
  var args = "activateAgent('" + context + "','" + entityName + "','" + id + "'," + status + ")";
  var cancelFunction = "cancelSelection('" + context + "'," + "'" + entityName + "'," + "'" + id + "')";
    $("#activateModal #ok").attr("onclick", args);
    $("#activateModal #cancel").attr("onclick",cancelFunction);
    $("#activateModal #cancel2").attr("onclick",cancelFunction);
    $('#activateModal').modal();   
}


/*TP: the delete modal for the cart system*/
function showDeleteCartModal( id){    
    var args = "deleteDataFromCart("+id+")";
    $("#deleteModalCart #ok").attr("onclick", args);
    $('#deleteModalCart').modal();
    return false;
}

/*TP: ajax submit form method using get*/
function submitgetForm(url,formData){
     console.log("URL: " + url);
    
    console.log("Data: " + formData);
    $('#loading2').removeClass("hidden");
    $.ajax({
       type : 'GET',
       url : url,
       data : formData,
       success: function(response){
           console.log("Successful: " + JSON.stringify(response));
           var resp = JSON.parse(response);
           
           if(resp.STATUS == "OK")
               updateSubmitSuccess(response);
           else if(resp.STATUS == "ERROR")
               updateSubmitError(response);
       },
       error: function(xHr, status, error){
           console.log("NOT Successful: " + xHr.responseText);
           //processSubmitError(xHr.responseText);
       }
    });
}

/*TP: ajax submit form method using post*/
function submitPostForm(url, formData){
    //url = appName + '/' + entityName;
    //$('#projectunitform').serialize()

    console.log("URL: " + url);
    
    console.log("Data: " + formData);
    $('#loading2').removeClass("hidden");
    
    $.ajax({
       type : 'POST',
       url : url,
       data : formData,
       success: function(response){
           console.log("Successful: " + JSON.stringify(response));
           var resp = JSON.parse(response);
           
           if(resp.STATUS == "OK")
               processSubmitSuccess(response);
           else if(resp.STATUS == "ERROR")
               processSubmitError(response);
       },
       error: function(xHr, status, error){
           console.log("NOT Successful: " + xHr.responseText);
           //processSubmitError(xHr.responseText);
       }
    });
}


/**
 * Validate Customer Form
 */

function validateCustomerRegForm()
{
    var errors = [];
    
    if($("#customerFirstname").val().trim() == '')
    {
        errors.push("Please enter first name");
    }
    if($("#customerMiddlename").val().trim() == '')
    {
        errors.push("Please enter middle name");
    }
    if($("#customerLastname").val().trim() == '')
    {
        errors.push("Please enter last name");
    }
    if($("#customerEmail").val().trim() == '')
    {
        errors.push("Please enter email");
    }
    if($("#customerPassword").val().trim() == '')
    {
        errors.push("Please enter password");
    }
    else
    {
        if($("#customerPassword").val().trim() != $("#customerConfirmPassword").val().trim())
        {
            errors.push("Password mismatch");
        }
    }
    if($("#customerStreet").val().trim() == '')
    {
        errors.push("Please enter street");
    }
    if($("#customerCity").val().trim() == '')
    {
        errors.push("Please enter city");
    }
    if($("#customerState").val().trim() == '')
    {
        errors.push("Please select state");
    }
    if($("#customerPhone").val().trim() == '')
    {
        errors.push("Please enter Phone Number");
    }
    if($("#customerKinNames").val().trim() == '')
    {
        errors.push("Please enter kin name");
    }
    if($("#customerKinPhone").val().trim() == '')
    {
        errors.push("Please enter kin Phone Number");
    }
    if($("#customerKinAddress").val().trim() == '')
    {
        errors.push("Please enter kin Address");
    }
    
    $("#customerErrorModal .modal-body").html("");
    

//    if(errors.length > 0)
//    {
//        var errorText = '';
//        
//        for(var key in errors){
//            var errorText = '' + errors[key] + '<br />';
//            $("#customerErrorModal .modal-body").append(errorText);
//        }
//        $("#customerErrorModal").modal();
//        return false;
//    }
//    else{
//        return true
//    }
    
    return true;
}

   
