const test=async (req,res) => {
    try {
        res.status(200).json({status:"success"})
    } catch (err) {
        res.status(401).json({status:"fail",data:err.message})
    }
    
}

module.exports={
    test
}