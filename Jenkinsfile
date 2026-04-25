pipeline {
    agent any

    // Parámetros de ejecución para permitir flexibilidad en el pipeline
    parameters {
        choice(name: 'PROJECT', choices: ['web'], description: 'Proyecto a ejecutar')
        choice(name: 'SUITE', choices: ['smoke', 'regression', 'all'], description: 'Suite de pruebas')
        choice(name: 'ENVIRONMENT', choices: ['qa', 'staging'], description: 'Entorno de ejecución')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox'], description: 'Navegador de ejecución')
    }

    environment {
        // Nombre del contenedor usado para ejecutar y posteriormente extraer resultados
        RUNNER_CONTAINER = 'qa-playwright-runner'
    }

    stages {

        stage('Checkout') {
            steps {
                // Obtiene el código desde el repositorio
                checkout scm
            }
        }

        stage('Prepare Results') {
            steps {
                sh '''
                    # Limpieza de ejecuciones anteriores
                    rm -rf results test-results

                    # Estructura de resultados del framework
                    mkdir -p results/raw results/processed results/evidence
                    mkdir -p test-results
                '''
            }
        }

        stage('Build Playwright Runner') {
            steps {
                // Construcción del contenedor que ejecuta Playwright
                sh 'docker-compose build qa-playwright'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {

                    // Eliminación de contenedor previo si existe
                    sh "docker rm -f ${RUNNER_CONTAINER} >/dev/null 2>&1 || true"

                    // Ejecución del runner con control manual del exit code
                    env.PLAYWRIGHT_EXIT = sh(
                        script: """
                        docker-compose run --name ${RUNNER_CONTAINER} qa-playwright bash -c '
                            # Ejecución de tests mediante orquestador QA
                            bash scripts/run/run-tests.sh ${params.PROJECT} ${params.SUITE} ${params.ENVIRONMENT} ${params.BROWSER}

                            # Captura del exit code de Playwright
                            TEST_EXIT=\$?

                            # Generación de resultados estructurados a partir del JSON raw
                            node scripts/process/generate-summary.js

                            # Se devuelve el exit code original para que Jenkins lo interprete correctamente
                            exit \$TEST_EXIT
                        '
                        """,
                        returnStatus: true
                    ).toString()
                }
            }
        }

        stage('Collect Results') {
            steps {
                sh '''
                    # Copia de resultados raw (Playwright + JUnit)
                    docker cp ${RUNNER_CONTAINER}:/app/results/raw ./results/ || true

                    # Copia de resultados procesados (summary.json)
                    docker cp ${RUNNER_CONTAINER}:/app/results/processed ./results/ || true

                    # Copia de evidencias (screenshots, videos, trace)
                    docker cp ${RUNNER_CONTAINER}:/app/results/evidence ./results/ || true

                    # Copia de resultados internos de Playwright
                    docker cp ${RUNNER_CONTAINER}:/app/test-results/. ./test-results/ || true
                '''
            }
        }
    }

    post {
        always {

            // Publicación de resultados JUnit para visualización en Jenkins
            junit allowEmptyResults: true, testResults: 'results/raw/junit.xml'

            // Archivado completo de resultados y evidencias
            archiveArtifacts artifacts: 'results/**/*, test-results/**/*', allowEmptyArchive: true

            // Limpieza del contenedor
            sh "docker rm -f ${RUNNER_CONTAINER} >/dev/null 2>&1 || true"

            script {
                // Ajuste del estado del build en función del resultado de Playwright
                if (env.PLAYWRIGHT_EXIT && env.PLAYWRIGHT_EXIT != '0') {
                    currentBuild.result = 'FAILURE'
                }
            }
        }
    }
}