var classeEvento = '';
$(document).ready(function () {
    $('.selectpicker').selectpicker();
    $('.selectpicker').selectpicker('refresh');
    $("#agendaOpcao").addClass("ocultarElemento");
    $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
    $('#txtIniEvento').clockpicker({
        placement: 'bottom',
        align: 'left',
        autoclose: true,
        //twelvehour: true,
        'default': '00:00'
    });
    $('#txtTermEvento').clockpicker({
        placement: 'bottom',
        align: 'left',
        autoclose: true,
        //twelvehour: true,
        'default': '00:00'
    });
    $('#external-events .external-event').each(function () {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true // maintain when user navigates (see docs on the renderEvent method)
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0, //  original position after the drag


        });

    });
    //$('.external-event').on("dragstart", function (event, ui) {
    //    var crt = this.cloneNode(true);
    //    document.body.appendChild(crt);
    //});

});
$J(document).ready(function () {
    $(document).on('click', '#btnSalvarEvento', function (e) {
        var dataEv = $('#txtDataEvento').val().split("/");
        classeEvento = $('#txtIdEvento').val();
        var descEv = $('#txtIdEvento').find("option:selected").text();
        var iniEv = $('#txtIniEvento').val() + ':00';
        var endEv = $('#txtTermEvento').val() + ':00';
        var evInicial = moment(dataEv[2] + '-' + dataEv[1] + '-' + dataEv[0] + 'T' + iniEv);
        var evFinal = moment(dataEv[2] + '-' + dataEv[1] + '-' + dataEv[0] + 'T' + endEv);

        var evento = {
            title: descEv,
            start: evInicial,
            end: evFinal,
            className: classeEvento
        }
        $('#calendarioAgenda').fullCalendar('renderEvent', evento);
    });
    $('#calendarioAgenda').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
        },
        locale: 'pt-br',
        theme: true,
        themeSystem: 'jquery-ui',
        editable: true,
        contentHeight: 600,
        droppable: true, // this allows things to be dropped onto the calendar
        dragRevertDuration: 0,
        drop: function (date, jsEvent, ui, resourceId) {
            console.log("Dropped on " + date.format('DD/MM/YYYY'));
            console.log($.trim($(this).text()));
            classeEvento = $(this).attr('data-class')
            openMD(date.format('DD/MM/YYYY'), $.trim($(this).text()))
            console.log(ui);
            console.log(resourceId);
        },
        eventDragStop: function (event, jsEvent, ui, view) {
            console.log('oooo')
            if (isEventOverDiv(jsEvent.clientX, jsEvent.clientY)) {
                $('#calendarioAgenda').fullCalendar('removeEvents', event._id);
                var el = $("<div class='fc-event'>").appendTo('#external-events-listing').text(event.title);
                el.draggable({
                    zIndex: 999,
                    revert: true,
                    revertDuration: 0
                });
                el.data('event', { title: event.title, id: event.id, stick: true });
            }
        },
        dayClick: function (date, jsEvent, view) {
            $('#txtIdEvento').selectpicker('val', 'bg-green');
            $('#txtIdEvento').prop('disabled', false);
            $('#txtIdEvento').selectpicker('refresh');
            $('#txtDataEvento').val(date.format('DD/MM/YYYY'));
            openMD(null, null);
        },
        eventClick: function (event) {
            openMD(null,event);
            return false;
        }

    });
    var isEventOverDiv = function (x, y) {

        var external_events = $('#external-events');
        var offset = external_events.offset();
        offset.right = external_events.width() + offset.left;
        offset.bottom = external_events.height() + offset.top;

        // Compare
        if (x >= offset.left
            && y >= offset.top
            && x <= offset.right
            && y <= offset.bottom) { return true; }
        return false;

    }

});
function openMD(data, evento) {
    if (data || evento) {
        if (data) {
            $('#txtIdEvento').selectpicker('val', classeEvento);
            $('#txtIdEvento').prop('disabled', true);;
            $('#txtIdEvento').selectpicker('refresh');
        } else {
            $('#txtIdEvento').selectpicker('val', evento.className);
            $('#txtIdEvento').prop('disabled', false);
            $('#txtIdEvento').selectpicker('refresh');
            var iniEv = evento.start.format('hh:mm')
            var endEv = evento.end.format('hh:mm')
            data = evento.start.format('DD/MM/YYYY')
            $('#txtIniEvento').val(iniEv);
            $('#txtTermEvento').val(endEv);
        }
        $('#txtDataEvento').val(data);
    }
    


    $('#modalEventoCalendario').modal({
        backdrop: 'static',
        keyboard: false
    });

}