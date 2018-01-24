/**
 * Created by anooj on 06/05/17.
 */
var mysqlConnection =   require('../utils/mysqlConnection');
var connection      =   new mysqlConnection();
var imageOperation  =   require('./imageOperations');



exports.getProductsFromId  =   function (productId, callback) {
    connection.executeQuery("select pr.*,cat.categoryName from products as pr left join categories as cat on pr.fkCategoryId=cat.pkCategoryId where pr.isProductBlocked = 0 and pkProductId=?",[productId],function (err, productBasicInfo) {
        connection.executeQuery("select * from productImages where fkProductId = ?",[productId],function (err, images) {
            callback(err,productBasicInfo,images);
        })
    })
};

exports.addToCart =   function (productData, callback) {
    var productObj  =   {
        fkProductId     :   productData.fkProductId,
        fkUserId        :   productData.fkUserId,
        height       :   productData.height,
        length       :   productData.length,
        breadth      :   productData.breadth,
        fkMaterialId        :   productData.fkMaterialId,
        fkColorId          :   productData.fkColorId,
        quality         :   productData.quality,
        quantity        :   productData.quantity,
        calculatedPrice           :   productData.price
    };
//console.log(productObj)
    connection.executeQuery("insert into usercarts set ?",[productObj],function (err, status) {
        callback(err,status);
    });
};

exports.getProductBasedCart =   function (productData, callback) {
    var query   =   "select * from usercarts where " +
        "fkUserId=? and fkProductId=? and height=? and length=? and breadth=? and fkMaterialId=? " +
        "and fkColorId=? and quality=?";
    var params  =   [
        productData.fkUserId,
        productData.fkProductId,
        productData.height,
        productData.length,
        productData.breadth,
        productData.fkMaterialId,
        productData.fkColorId,
        productData.quality
    ];
    connection.executeQuery(query,params,function (err, status) {
        callback(err,status);
    });
}

exports.getTotalCart    =   function (userId, callback) {
    var query   =   "select uc.*,pr.*,user.name,user.pkUserId,user.mobileNumber,mat.*,col.* from usercarts as uc " +
        "left join products as pr on pr.pkProductId=uc.fkProductId " +
        "left join user as user on user.pkUserId=uc.fkUserId " +
        "left join materials as mat on mat.pkMaterialId=uc.fkMaterialId " +
        "left join colors as col on col.pkColorId=uc.fkColorId where uc.fkUserId=?";
    connection.executeQuery(query,[userId],function (err, status) {
        console.log("GET_TOTAL_CART: ",status);
        callback(err,status);
    });
};

exports.getOrderGroups  =   function (userId, callback) {
    var query = "select * from ordergroup where fkUserId = ? order by orderedOn desc";
    connection.executeQuery(query,[userId],function (err, status) {
        callback(err,status);
    });
};

exports.getOrderGroupsWithGroupId  =   function (userId, groupId, callback) {
    var query = "select * from ordergroup where fkUserId = ? and orderGroupId = ? order by orderedOn desc";
    connection.executeQuery(query,[userId,groupId],function (err, status) {
        callback(err,status);
    });
};

exports.getAllOrders = function (userId, callback) {
    var query = "select * from orders where fkUserId = ?";
    connection.executeQuery(query,[userId],function (err, status) {
        callback(err,status);
    });
}

exports.getAllOrdersFromGroup = function (userId, groupNumber, callback) {
    var query = "select * from orders ord left join products prd on ord.fkProductId=prd.pkProductId where ord.fkUserId = ? and ord.orderGroupId=?";
    connection.executeQuery(query,[userId,groupNumber],function (err, status) {
        callback(err,status);
    });
}

exports.getAllOrdersFromGroupId = function (groupNumber, callback) {
    var query = "select * from orders ord left join products prd on ord.fkProductId=prd.pkProductId where ord.orderGroupId=?";
    connection.executeQuery(query,[groupNumber],function (err, status) {
        callback(err,status);
    });
}


exports.updateCart   =   function (cartInfo, callback) {
    var cartId   =   cartInfo.pkUserCartId;
    connection.executeQuery("update usercarts set ? where pkUserCartId="+cartId,cartInfo,function (err, stat) {
        callback(err,stat);
    })
};

exports.removeCart   =   function (cartId,userId, callback) {
    connection.executeQuery("delete from usercarts where pkUserCartId=? and fkUserId=?",[cartId,userId],function (err, stat) {
        callback(err,stat);
    });
};

exports.removeAllCart   =   function (userId,callback) {
    connection.executeQuery("delete from usercarts where fkUserId=?",[userId],function (err, stat) {
       callback(err,stat)
    });
};



exports.deleteProduct   =   function (cartId, callback) {
    connection.executeQuery("delete from usercarts where pkUserCartId=?",[cartId],function (err, stat) {
        callback(err,stat);
    })
}

exports.isWishListExist =   function (productId, userId, callback) {
    console.log("isWishlistExist")
    console.log(userId)
    console.log(productId)
    connection.executeQuery("select * from wishlist where fkUserId=? and fkProductId=?",[userId,productId],function (err, stat) {
        if(!err && stat != undefined && stat.length > 0){
            callback(true,stat);
        }else{
            callback(false,null);
        }

    })
};

exports.addToWishlist   =   function (productId, userId, callback) {
    var wishObj =   {
        fkProductId:productId,
        fkUserId:userId
    };
    connection.executeQuery("insert into wishlist set ?",wishObj,function (err, stat) {
        callback(err,stat);
    })
};


exports.removeFromWishlist   =   function (productId, userId, callback) {
    connection.executeQuery("delete from wishlist where fkProductId=? and fkUserId=?",[productId,userId],function (err, stat) {
       console.log("Remove: ",stat)
       console.log("Remove: ",err)
        callback(err,stat);
    })
};


exports.getMyWishlist   =   function (userId, callback) {
    connection.executeQuery("select wis.*,pro.* from wishlist as wis left join products as pro on pro.pkProductId=wis.fkProductId where wis.fkUserId=?",[userId],function (err, stat) {
        callback(err,stat);
    })
};

exports.addUserProduct  =   function (userId, productData,callback) {
    var productObj  =   {
        productName     :   productData.productName,
        fkUserId        :   productData.fkUserId,
        height          :   productData.height,
        length          :   productData.length,
        breadth         :   productData.breadth,
        fkMaterialId    :   productData.fkMaterialId,
        fkColorId       :   productData.fkColorId,
        quality         :   productData.quality,
        quantity        :   productData.quantity
    };
//console.log(productObj)
    connection.executeQuery("insert into usercarts set ?",[productObj],function (err, status) {
        callback(err,status);
    });
};

exports.addOrder    =   function (orderObj, callback) {
    connection.executeQuery("insert into orders set ?",[orderObj],function (err, status) {
        callback(err,status);
    });
};

exports.addToOrderGroup = function (orderGrpObj, callback) {
    connection.executeQuery("insert into ordergroup set ?",[orderGrpObj],function (err, status) {
        callback(err,status);
    });
}

exports.getAllPendingOrders =   function (callback) {
    connection.executeQuery("select * from ordergroup ogp left join user on ogp.fkUserId=user.pkUserId where ogp.orderStatus = 'ORDERED' OR ogp.orderStatus = 'IN PRINT' OR ogp.orderStatus = 'PRINTING' OR ogp.orderStatus = 'SHIPPED' order by ogp.orderedOn desc",[],function (err, stat) {
        callback(err,stat)
    });
}
exports.changeOrderStatus   =   function (orderId, orderStatus, callback) {
    var orderUpdate =   {
        orderStatus:orderStatus
    };
    connection.executeQuery("update orders set ? where pkOrderId=?",[orderUpdate,orderId],function (err, status) {
        connection.executeQuery("select * from orders where pkOrderId=?",[orderId],function (err, status) {
            callback(err, status);
        });
    });
};

exports.updateGroupOrder    =   function (userId, groupId, updateInfo, callback) {
    connection.executeQuery("update ordergroup set ? where orderGroupId=? and fkUserId=?",[updateInfo,groupId,userId],function (err, status) {
        //connection.executeQuery("select * from orders where pkOrderId=?",[orderId],function (err, status) {
        callback(err, status);
        //});
    });
}

exports.changeOrderGroupStatus   =   function (groupId, userId, orderStatus, callback) {
    var orderUpdate =   {
        orderStatus:orderStatus
    };
    console.log(orderStatus)
    connection.executeQuery("update ordergroup set orderStatus=? where orderGroupId=? and fkUserId=?",[orderStatus,groupId,userId],function (err, status) {
        //connection.executeQuery("select * from orders where pkOrderId=?",[orderId],function (err, status) {
            callback(err, status);
        //});
    });
}