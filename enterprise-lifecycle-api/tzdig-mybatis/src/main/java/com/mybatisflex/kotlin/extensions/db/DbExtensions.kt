@file:Suppress("unused")
@file:JvmName("DbExtensionsKtKt")

package com.mybatisflex.kotlin.extensions.db

import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.scope.QueryScope
import java.io.Serializable

/**
 * 根据主键查询一条数据
 * @param id 主键值
 */
inline fun <reified E : Any> queryOneById(id: Serializable): E? {
    val baseMapper = E::class.baseMapperOrNull
    return if (baseMapper != null) {
        baseMapper.selectOneById(id)
    } else {
        E::class.tableInfo.let {
            Db.selectOneById(it.schema, it.tableName, id)
        }?.toEntity(E::class.java)
    }
}

/**
 * 根据主键查询一组数据
 * @param ids 主键值
 */
inline fun <reified E : Any> queryListByIds(vararg ids: Serializable): List<E> {
    val baseMapper = E::class.baseMapperOrNull
    return if (baseMapper != null) {
        baseMapper.selectListByIds(ids.asList())
    } else {
        E::class.tableInfo.let {
            ids.mapNotNull { id -> Db.selectOneById(it.schema, it.tableName, ids)?.toEntity(E::class.java) }
        }
    }
}

/**
 * 根据主键查询一组数据
 * @param ids 主键值
 */
inline fun <reified E : Any> queryListByIds(ids: Collection<Serializable>): List<E> {
    val baseMapper = E::class.baseMapperOrNull
    return if (baseMapper != null) {
        baseMapper.selectListByIds(ids)
    } else {
        E::class.tableInfo.let {
            ids.mapNotNull { id -> Db.selectOneById(it.schema, it.tableName, ids)?.toEntity(E::class.java) }
        }
    }
}

/**
 * 查询满足条件的记录数
 * @param init 查询作用域初始化函数
 */
inline fun <reified E : Any> queryCount(
    noinline init: QueryScope.() -> Unit,
): Long {
    val query = QueryScope().apply(init)
    val baseMapper = E::class.baseMapperOrNull
    return if (baseMapper != null) {
        baseMapper.selectCountByQuery(query)
    } else E::class.tableInfo.let {
        Db.selectCountByQuery(it.schema, it.tableName, query)
    }
}
