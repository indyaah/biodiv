package species.participation
import species.*;
import content.eml.Document;
import species.groups.UserGroup;
import species.auth.SUser;

class DigestService {
    
    def activityFeedService;
    def observationService;

    static transactional = true
    
    def sendDigest(Digest digest){
        def digestContent = fetchDigestContent(digest)
        if(digestContent){
            log.debug "SENDING A DIGEST MAIL FOR GROUP : " + digest.userGroup
            def otherParams = [:]
            otherParams['digestContent'] = digestContent
            otherParams['userGroup'] = digest.userGroup
            log.debug "======== DIGEST CONTENT ========= " + otherParams['digestContent']
            def sp = new Species()
            observationService.sendNotificationMail(observationService.DIGEST_MAIL,sp,null,null,null,otherParams)
            digest.lastSent = new Date()
            if(digest.save(flush:true)){
                digest.errors.allErrors.each { log.error it }
            }
            log.debug " MAIL SENT and Digest Last sent time updated "
        }
    }

    private def fetchDigestContent(Digest digest){
        def params = [:]
        params.rootHolderId = digest.userGroup.id
        params.rootHolderType = UserGroup.class.getCanonicalName()
        params.refTime = ""+digest.lastSent.getTime()
        params.timeLine = "older"
        params.feedOrder = "latestFirst"
        params.feedType = "GroupSpecific"

        def res = [:]
        def obvList = []
        def unidObvList = []
        def spList = []
        def docList = []
        def userList = []
        if(digest.threshold > activityFeedService.getActivityFeeds(params).size()){
            res = null
        }
        else{
            def feedsList = activityFeedService.getActivityFeeds(params)
            feedsList.each{
                switch(it.rootHolderType){
                    case Observation.class.getCanonicalName():
                        def obv = Observation.get(it.rootHolderId)
                        if(obv.maxVotedReco){
                            obvList.add(obv)
                        }
                        else{
                            unidObvList.add(obv)
                        }
                    break
                    
                    case Checklists.class.getCanonicalName():
                        def chk = Checklists.get(it.rootHolderId)
                        obvList.add(chk)
                    break


                    case Species.class.getCanonicalName():
                        def sp = Species.get(it.rootHolderId)
                        spList.add(sp)
                    break
                    
                    case Document.class.getCanonicalName():
                        def doc = Document.get(it.rootHolderId)
                        docList.add(doc)
                    break

                    case SUser.class.getCanonicalName():
                        def user = SUser.get(it.rootHolderId)
                        userList.add(user)
                    break
                } 
            }
            res['observations'] = obvList
            res['unidObvs'] = unidObvList
            res['species'] = spList
            res['documents'] = docList
            res['users'] = userList
        }
        return res
    }
}