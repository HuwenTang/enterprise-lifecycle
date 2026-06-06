package com.tzdig.framework.core.util

import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.reflect.MethodSignature
import org.springframework.expression.spel.standard.SpelExpressionParser
import org.springframework.expression.spel.support.StandardEvaluationContext
import java.util.concurrent.ConcurrentHashMap

object SpelExpressionUtils {
    private val parser = SpelExpressionParser()
    private val evaluationContextCache = ConcurrentHashMap<String, StandardEvaluationContext>()
    fun evaluate(expression: String, joinPoint: ProceedingJoinPoint): String? {
        val context = evaluationContextCache.getOrPut(expression) {
            val ctx = StandardEvaluationContext()
            val parameters = joinPoint.signature as MethodSignature
            val paramNames = parameters.parameterNames
            val args = joinPoint.args
            for (i in paramNames.indices) {
                ctx.setVariable(paramNames[i], args.getOrNull(i))
            }
            // 绑定根对象
            ctx.setRootObject(joinPoint.target)
            ctx
        }
        val expr = parser.parseExpression(expression)
        return expr.getValue(context, String::class.java)
    }
}
