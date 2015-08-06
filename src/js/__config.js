function Config() {
    return {
        tab: '#myTab',
        modal: '#myModal',
        confirm: '#modalConfirm',
        alert: '#modalAlert',
        notification: '#notification',
        iframe: {
            height: 600
        },
        grid: {
            options: {
                pageable: true
            },
            columns: {

            },
            url: {
                area: 'Common',
                controller: 'Country',
                action: 'GetColumnFormat'
            }
        },
        ajax: {

        }
    }
}