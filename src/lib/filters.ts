export const allowedKeys = ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete']

export const filterFloatNumbersOnly = (event: KeyboardEvent) => {
    const target = (event.target as HTMLTextAreaElement)
    const value = target.value

    const expect = value + event.key

    if (allowedKeys.includes(event.code)) {
        return true
    }

    if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
        (event as KeyboardEvent).preventDefault()
    } else {
        return true
    }
}

export const filterNumbersOnly = (event: KeyboardEvent) => {
    const target = (event.target as HTMLTextAreaElement)
    const value = target.value

    const expect = value + event.key

    if (allowedKeys.includes(event.code)) {
        return true
    }

    if (!/^[-+]?[0-9]*$/.test(expect)) {
        (event as KeyboardEvent).preventDefault()
    } else {
        return true
    }
}