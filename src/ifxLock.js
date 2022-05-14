
const locks = {}
const enableLogging = false
let number = 0

const createError = function (name, message) {
  const err = Error(message)
  err.name = name
  return err
}

const log = function (...args) {
  if (enableLogging) {
    console.log(...args)
  }
}

const getLockNumber = function () {
  number += 1
  return number
}

const isLocked = function (lock) {
  if (lock == null) {
    return false
  }

  if (lock.queue == null) {
    return false
  }

  return true
}

const destroyLock = function (name) {
  locks[name] = undefined
}

const findLock = function (name) {
  if (locks[name] == null) {
    locks[name] = {
      number: null,
      timer: null,
      queue: null,
    }
  }

  return locks[name]
}

const createLockFunctions = function (name, number, expiration) {
  const isValid = function () {
    return validateLock(name, number)
  }

  const renew = function () {
    if (isValid()) {
      renewLock(name, number, expiration)
    }
  }

  const release = function () {
    if (isValid()) {
      releaseLock(name)
    }
  }

  return {
    isValid,
    renew,
    release,
  }
}

export const failLock = function (name, expiration = 60 * 1000) {
  const lock = findLock(name)
  log(`++++ LOCK SYSTEM ++++ call failLock ${name}`)

  if (isLocked(lock)) {
    log(`++++ LOCK SYSTEM ++++ denied lock ${name}`)
    throw createError(`FAILLOCK`, `Failed to get lock: "${name}"`)
  } else {
    log(`++++ LOCK SYSTEM ++++ acquired lock ${name}`)
    const lock = findLock(name)
    lock.number = getLockNumber()
    lock.timer = setTimeout(expireLock(name), expiration)
    lock.queue = []
    return createLockFunctions(name, lock.number, expiration)
  }
}

export const awaitLock = function (name, expiration = 60 * 1000) {
  const lock = findLock(name)
  log(`++++ LOCK SYSTEM ++++ call awaitLock ${name}`)

  if (isLocked(lock)) {
    log(`++++ LOCK SYSTEM ++++ added to lock queue ${name}`)
    const ticket = {
      expiration,
    }

    ticket.promise = new Promise(function (resolve, reject) {
      ticket.resolve = resolve
      ticket.reject = reject
    })

    lock.queue.push(ticket)

    return ticket.promise
  } else {
    log(`++++ LOCK SYSTEM ++++ acquired lock ${name}`)
    lock.number = getLockNumber()
    lock.timer = setTimeout(expireLock(name), expiration)
    lock.queue = []
    return createLockFunctions(name, lock.number, expiration)
  }
}

const renewLock = function (name, number, expiration) {
  log(`++++ LOCK SYSTEM ++++ call renewLock ${name}`)
  const lock = findLock(name)
  if (lock.timer) { clearTimeout(lock.timer) }
  lock.timer = setTimeout(expireLock(name), expiration)
}

const releaseLock = function (name) {
  const lock = findLock(name)
  log(`++++ LOCK SYSTEM ++++ call releaseLock ${name}`)

  if (isLocked(lock)) {
    if (lock.timer) { clearTimeout(lock.timer) }
  }

  if (isLocked(lock) && lock.queue.length > 0) {
    const ticket = lock.queue.shift()
    lock.number = getLockNumber()
    lock.timer = setTimeout(expireLock(name), ticket.expiration)
    ticket.resolve(createLockFunctions(name, lock.number))
  } else {
    destroyLock(name)
  }
}

const validateLock = function (name, number) {
  const lock = findLock(name)
  return lock.number === number
}

const expireLock = function (name) {
  return function () {
    log(`++++ LOCK SYSTEM ++++ lock expired ${name}`)
    releaseLock(name)
  }
}

export default {
  failLock,
  awaitLock,
}

