pipeline {
    agent any

    environment {
        RUNNER_CONTAINER = 'qa-playwright-runner'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Results') {
            steps {
                sh '''
                    rm -rf results test-results
                    mkdir -p results/raw results/processed results/evidence
                    mkdir -p test-results
                '''
            }
        }

        stage('Build Playwright Runner') {
            steps {
                sh 'docker-compose build qa-playwright'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    sh "docker rm -f ${RUNNER_CONTAINER} >/dev/null 2>&1 || true"
                    env.PLAYWRIGHT_EXIT = sh(
                        script: "docker-compose run --name ${RUNNER_CONTAINER} qa-playwright bash scripts/run/run-tests.sh web smoke qa chromium",
                        returnStatus: true
                    ).toString()
                }
            }
        }

        stage('Collect Results') {
            steps {
                sh '''
                    docker cp ${RUNNER_CONTAINER}:/app/results/raw ./results/ || true
                    docker cp ${RUNNER_CONTAINER}:/app/results/evidence ./results/ || true
                    docker cp ${RUNNER_CONTAINER}:/app/test-results/. ./test-results/ || true
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'results/raw/junit.xml'
            archiveArtifacts artifacts: 'results/**/*, test-results/**/*', allowEmptyArchive: true
            sh "docker rm -f ${RUNNER_CONTAINER} >/dev/null 2>&1 || true"
            script {
                if (env.PLAYWRIGHT_EXIT && env.PLAYWRIGHT_EXIT != '0') {
                    currentBuild.result = 'FAILURE'
                }
            }
        }
    }
}