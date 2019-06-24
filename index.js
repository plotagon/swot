const fs = require('fs')

function status(email) {
    const domain = email.trim().toLowerCase().split('@').reverse()[0]
    
    const blacklist = fs.readFileSync(__dirname + '/lib/domains/blacklist.txt', { encoding: 'utf8' }).trim().split('\n')
    const tlds = fs.readFileSync(__dirname + '/lib/domains/tlds.txt', { encoding: 'utf8' }).trim().split('\n')
    
    if (anySuffixMatches(blacklist, domain))
        return 'blacklisted'
    else if (anySuffixMatches(tlds, domain))
        return 'academic'
    else if (inDomainTree(domain))
        return 'academic'
    else
        return 'not academic'
}

function anySuffixMatches(list, domain) {
    return list.some(suffix => domain.endsWith('.'+suffix) || domain === suffix)
}

function inDomainTree(domain) {
    const path = domain.split('.').reverse()
    var resourcePath = __dirname + '/lib/domains/'
    for (var part of path) {
        resourcePath = resourcePath + '/' + part
        var fileExists = fs.existsSync(resourcePath + '.txt')
        if (fileExists) {
            return true
        }
    }
    return false
}

const email = process.argv[2]
if (email) {
    console.log(status(email))
}

module.exports = {
    status: status,
    isAcademic(email) {
        return 'academic' === status(email)
    }
}
